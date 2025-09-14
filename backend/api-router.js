const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { initializeDatabase, isAuthenticated } = require('./database.js');
const { getCombinedDataFromFileSystem } = require('./content-parser.js');

const router = express.Router();

let cachedData = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = path.join(__dirname, '../uploads/avatars');
        fs.mkdir(dir, { recursive: true })
            .then(() => cb(null, dir))
            .catch(err => cb(err, dir));
    },
    filename: function (req, file, cb) {
        const userId = req.session.user.user_id;
        const fileExtension = path.extname(file.originalname);
        cb(null, `avatar_${userId}_${Date.now()}${fileExtension}`);
    }
});

const upload = multer({ storage: storage });

router.get('/articles', async (req, res) => {
    const db = await initializeDatabase();

    const now = Date.now();
    if (!cachedData || (now - lastCacheTime > CACHE_DURATION)) {
        cachedData = await getCombinedDataFromFileSystem();
        lastCacheTime = now;
    }

    const { articles, staff } = cachedData;
    let articlesWithData = [];

    try {
        const articleIds = articles.map(article => article.id);

        const articleDataPromises = articleIds.map(async (id) => {
            let dynamicData = await db.get('SELECT likes FROM articles WHERE article_id = ?', id);
            if (!dynamicData) {
                await db.run('INSERT OR IGNORE INTO articles (article_id, likes) VALUES (?, 0)', id);
                dynamicData = { likes: 0 };
            }
            return { article_id: id, likes: dynamicData.likes };
        });

        const articleDynamicData = await Promise.all(articleDataPromises);
        const articleDataMap = new Map(articleDynamicData.map(data => [data.article_id, data]));

        articlesWithData = articles.map(article => {
            const data = articleDataMap.get(article.id) || { likes: 0 };
            return { ...article, likes: data.likes };
        });

        if (req.session.user) {
            const [userLikes, userBookmarks] = await Promise.all([
                db.all('SELECT article_id FROM user_likes WHERE user_id = ?', req.session.user.user_id),
                db.all('SELECT article_id FROM user_bookmarks WHERE user_id = ?', req.session.user.user_id)
            ]);

            const likedArticleIds = userLikes.map(like => like.article_id);
            const bookmarkedArticleIds = userBookmarks.map(bookmark => bookmark.article_id);

            articlesWithData = articlesWithData.map(article => ({
                ...article,
                user_has_liked: likedArticleIds.includes(article.id),
                user_has_bookmarked: bookmarkedArticleIds.includes(article.id)
            }));
        }

        res.json({ articles: articlesWithData, staff });

    } catch (error) {
        console.error('Error augmenting articles with DB data:', error);
        res.status(500).json({ error: 'Failed to retrieve article data.' });
    }
});

router.post('/articles/:id/like', isAuthenticated, async (req, res) => {
    const db = await initializeDatabase();
    const articleId = req.params.id;
    const { action } = req.body;
    const { user_id } = req.session.user;

    try {
        const existingLike = await db.get('SELECT * FROM user_likes WHERE user_id = ? AND article_id = ?', user_id, articleId);

        if (action === 'like' && !existingLike) {
            await db.run('INSERT INTO user_likes (user_id, article_id) VALUES (?, ?)', user_id, articleId);
            await db.run('UPDATE articles SET likes = likes + 1 WHERE article_id = ?', articleId);
        } else if (action === 'unlike' && existingLike) {
            await db.run('DELETE FROM user_likes WHERE user_id = ? AND article_id = ?', user_id, articleId);
            await db.run('UPDATE articles SET likes = MAX(0, likes - 1) WHERE article_id = ?', articleId);
        }

        const result = await db.get('SELECT likes FROM articles WHERE article_id = ?', articleId);
        const userHasLiked = !!(await db.get('SELECT 1 FROM user_likes WHERE user_id = ? AND article_id = ?', user_id, articleId));

        res.status(200).json({ likes: result ? result.likes : 0, user_has_liked: userHasLiked });
    } catch (error) {
        console.error('Error processing like:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

router.post('/articles/:id/bookmark', isAuthenticated, async (req, res) => {
    const db = await initializeDatabase();
    const articleId = req.params.id;
    const { action } = req.body;
    const { user_id } = req.session.user;

    try {
        const existingBookmark = await db.get('SELECT * FROM user_bookmarks WHERE user_id = ? AND article_id = ?', user_id, articleId);

        if (action === 'bookmark' && !existingBookmark) {
            await db.run('INSERT INTO user_bookmarks (user_id, article_id) VALUES (?, ?)', user_id, articleId);
        } else if (action === 'unbookmark' && existingBookmark) {
            await db.run('DELETE FROM user_bookmarks WHERE user_id = ? AND article_id = ?', user_id, articleId);
        }

        const userHasBookmarked = !!(await db.get('SELECT 1 FROM user_bookmarks WHERE user_id = ? AND article_id = ?', user_id, articleId));

        res.status(200).json({ user_has_bookmarked: userHasBookmarked, bookmarked: userHasBookmarked });
    } catch (error) {
        console.error('Error processing bookmark:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});


router.get('/articles/:id/comments', async (req, res) => {
    const db = await initializeDatabase();
    const articleId = req.params.id;
    const comments = await db.all(`
        SELECT
            c.comment_id, c.article_id, c.author_id, c.author_name, c.content, c.timestamp,
            u.custom_avatar
        FROM comments c
        LEFT JOIN users u ON c.author_id = u.user_id
        WHERE c.article_id = ?
        ORDER BY c.timestamp DESC
    `, articleId);
    res.json(comments);
});

router.post('/articles/:id/comments', isAuthenticated, async (req, res) => {
    const db = await initializeDatabase();
    const articleId = req.params.id;
    const { content } = req.body;
    const { user_id, username } = req.session.user;

    if (!content) {
        return res.status(400).json({ error: 'Comment content is required.' });
    }

    try {
        const result = await db.run(
            'INSERT INTO comments (article_id, author_id, author_name, content) VALUES (?, ?, ?, ?)',
            articleId,
            user_id,
            username,
            content
        );

        const newComment = await db.get(`
            SELECT
                c.comment_id, c.article_id, c.author_id, c.author_name, c.content, c.timestamp,
                u.custom_avatar
            FROM comments c
            LEFT JOIN users u ON c.author_id = u.user_id
            WHERE c.comment_id = ?
        `, result.lastID);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ error: 'An error occurred while posting the comment.' });
    }
});

router.put('/comments/:commentId', isAuthenticated, async (req, res) => {
    const db = await initializeDatabase();
    const commentId = req.params.commentId;
    const { content } = req.body;
    const { user_id } = req.session.user;

    if (!content) {
        return res.status(400).json({ error: 'Comment content is required.' });
    }

    try {
        const comment = await db.get('SELECT * FROM comments WHERE comment_id = ? AND author_id = ?', commentId, user_id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found or you do not have permission to edit this comment.' });
        }

        await db.run('UPDATE comments SET content = ? WHERE comment_id = ?', content, commentId);
        const updatedComment = await db.get('SELECT * FROM comments WHERE comment_id = ?', commentId);
        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error editing comment:', error);
        res.status(500).json({ error: 'An error occurred while editing the comment.' });
    }
});

router.delete('/comments/:commentId', isAuthenticated, async (req, res) => {
    const db = await initializeDatabase();
    const commentId = req.params.commentId;
    const { user_id } = req.session.user;

    try {
        const comment = await db.get('SELECT * FROM comments WHERE comment_id = ? AND author_id = ?', commentId, user_id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found or you do not have permission to delete this comment.' });
        }

        await db.run('DELETE FROM comments WHERE comment_id = ?', commentId);
        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'An error occurred while deleting the comment.' });
    }
});

router.post('/articles/:id/view', isAuthenticated, async (req, res) => {
    const db = await initializeDatabase();
    const articleId = req.params.id;
    const { user_id } = req.session.user;

    try {
        await db.run('INSERT OR IGNORE INTO user_article_views (user_id, article_id) VALUES (?, ?)', user_id, articleId);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error tracking article view:', error);
        res.status(500).json({ error: 'An error occurred while tracking the view.' });
    }
});

router.get('/account/data', isAuthenticated, async (req, res) => {
    const db = await initializeDatabase();
    const { user_id } = req.session.user;

    try {
        const user = await db.get('SELECT username, created_at, custom_avatar FROM users WHERE user_id = ?', user_id);
        const comments = await db.all('SELECT * FROM comments WHERE author_id = ? ORDER BY timestamp DESC', user_id);
        const [likedArticles, bookmarkedArticles, viewedArticles] = await Promise.all([
            db.all('SELECT article_id FROM user_likes WHERE user_id = ?', user_id),
            db.all('SELECT article_id FROM user_bookmarks WHERE user_id = ?', user_id),
            db.all('SELECT article_id FROM user_article_views WHERE user_id = ?', user_id)
        ]);
        const likedArticleIds = likedArticles.map(like => like.article_id);
        const bookmarkedArticleIds = bookmarkedArticles.map(bookmark => bookmark.article_id);
        const viewedArticleIds = viewedArticles.map(view => view.article_id);

        res.status(200).json({
            username: user.username,
            joinDate: user.created_at,
            customAvatar: user.custom_avatar,
            stats: {
                comments: comments.length,
                likes: likedArticleIds.length,
                bookmarks: bookmarkedArticleIds.length,
                articlesViewed: viewedArticleIds.length
            },
            comments: comments.map(comment => ({
                content: comment.content,
                timestamp: comment.timestamp,
                article_id: comment.article_id
            })),
            likedArticleIds,
            bookmarkedArticleIds,
            viewedArticleIds
        });

    } catch (error) {
        console.error('Error fetching account data:', error);
        res.status(500).json({ error: 'Failed to retrieve account data.' });
    }
});

router.post('/account/avatar', isAuthenticated, upload.single('avatar'), async (req, res) => {
    const db = await initializeDatabase();
    const { user_id } = req.session.user;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const uploadsDir = path.join(__dirname, '../uploads/avatars');
        try {
            await fs.access(uploadsDir);
        } catch {
            await fs.mkdir(uploadsDir, { recursive: true });
        }

        const fileExtension = path.extname(req.file.originalname);
        const fileName = `avatar_${user_id}_${Date.now()}${fileExtension}`;
        const filePath = path.join(uploadsDir, fileName);

        await fs.rename(req.file.path, filePath);

        const oldUser = await db.get('SELECT custom_avatar FROM users WHERE user_id = ?', user_id);
        if (oldUser && oldUser.custom_avatar) {
            const oldFilePath = path.join(__dirname, '..', oldUser.custom_avatar);
            try {
                await fs.unlink(oldFilePath);
            } catch (error) {
                console.error('Error deleting old avatar:', error);
            }
        }

        const avatarUrl = `uploads/avatars/${fileName}`;
        await db.run('UPDATE users SET custom_avatar = ? WHERE user_id = ?', avatarUrl, user_id);

        if (req.session.user) {
            req.session.user.custom_avatar = avatarUrl;
        }

        res.status(200).json({ avatarUrl });
    } catch (error) {
        console.error('Error uploading avatar:', error);
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (cleanupError) {
                console.error('Error cleaning up file:', cleanupError);
            }
        }
        res.status(500).json({ error: 'An error occurred while uploading the avatar.' });
    }
});

router.delete('/account/avatar', isAuthenticated, async (req, res) => {
    const db = await initializeDatabase();
    const { user_id } = req.session.user;

    try {
        const user = await db.get('SELECT custom_avatar FROM users WHERE user_id = ?', user_id);

        if (user && user.custom_avatar) {
            const filePath = path.join(__dirname, '..', user.custom_avatar);
            try {
                await fs.unlink(filePath);
            } catch (error) {
                console.error('Error deleting avatar file:', error);
            }
        }

        await db.run('UPDATE users SET custom_avatar = NULL WHERE user_id = ?', user_id);

        if (req.session.user) {
            req.session.user.custom_avatar = null;
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error removing avatar:', error);
        res.status(500).json({ error: 'An error occurred while removing the avatar.' });
    }
});

router.delete('/account', isAuthenticated, async (req, res) => {
    const db = await initializeDatabase();
    const { user_id } = req.session.user;

    try {
        const user = await db.get('SELECT custom_avatar FROM users WHERE user_id = ?', user_id);
        if (user && user.custom_avatar) {
            const filePath = path.join(__dirname, '..', user.custom_avatar);
            try {
                await fs.unlink(filePath);
            } catch (error) {
                console.error('Error deleting avatar file:', error);
            }
        }

        await db.run('DELETE FROM users WHERE user_id = ?', user_id);
        req.session.destroy();
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'An error occurred while deleting your account.' });
    }
});

module.exports = router;