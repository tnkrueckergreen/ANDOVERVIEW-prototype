import { getCombinedData, likeArticle, bookmarkArticle, getComments, postComment, editComment, deleteComment, trackArticleView } from '../api.js';
import { SocialShare } from '../components/common/SocialShare.js';
import { SmallCard } from '../components/cards/SmallCard.js';
import { AvatarStack } from '../components/metadata/Authors.js';
import { getIsLoggedIn, getCurrentUser } from '../auth.js';
import { showError, showSuccess, showWarning } from '../lib/toast.js';
import { CommentAvatar } from '../components/common/Avatar.js';
import { getRecommendedArticles } from '../lib/recommendations.js';
import { renderList } from '../lib/template.js';
import { showConfetti } from '../lib/effects.js';

let scrollListener = null;

function handleScrollPositioning(articleId) {
    const storageKey = `scrollPos-${articleId}`;
    const savedPosition = sessionStorage.getItem(storageKey);
    if (savedPosition) {
        setTimeout(() => {
            window.scrollTo(0, parseInt(savedPosition, 10));
        }, 10);
        sessionStorage.removeItem(storageKey);
    }
    if (scrollListener) {
        window.removeEventListener('beforeunload', scrollListener);
    }
    scrollListener = () => {
        if (window.scrollY > 200) {
            sessionStorage.setItem(storageKey, window.scrollY.toString());
        }
    };
    window.addEventListener('beforeunload', scrollListener);
}

function MoreLikeThisSection(recommendedArticles) {
    if (!recommendedArticles || recommendedArticles.length === 0) {
        return '';
    }

    const articleCards = renderList(recommendedArticles, SmallCard);

    return `
        <section class="more-like-this-section">
            <h2>More Like This</h2>
            <div class="article-grid">
                ${articleCards}
            </div>
        </section>
    `;
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString.replace(' ', 'T') + 'Z');
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 10) return "just now";
    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
}

function createAuthorLineHTML(writers) { if (!writers || writers.length === 0) return ''; const irregularPlurals = { 'Editor-in-Chief': 'Editors-in-Chief' }; const irregularSingulars = Object.fromEntries(Object.entries(irregularPlurals).map(([s, p]) => [p, s])); function normalizeRole(role, count) { if (!role) return ''; if (count === 1) { if (irregularSingulars[role]) return irregularSingulars[role]; if (role.endsWith('s') && !role.endsWith('ss') && !['arts', 'sports'].includes(role.toLowerCase())) { return role.slice(0, -1); } return role; } else { if (irregularPlurals[role]) return irregularPlurals[role]; if (!role.endsWith('s')) return `${role}s`; return role; } } const formatNames = (writers) => { const linkedNames = writers.map(w => `<a href="${w.authorLink || `#author/${encodeURIComponent(w.name)}`}" class="author-link">${w.name}</a>`); if (linkedNames.length === 1) return linkedNames[0]; if (linkedNames.length === 2) return linkedNames.join(' and '); return `${linkedNames.slice(0, -1).join(', ')}, and ${linkedNames.slice(-1)}`; }; const grouped = writers.reduce((acc, writer) => { const baseRole = normalizeRole(writer.role || '_noRole', 1); const isFormer = !writer.isCurrentStaff; const key = `${baseRole}_${isFormer}`; if (!acc[key]) acc[key] = []; acc[key].push(writer); return acc; }, {}); const parts = Object.entries(grouped).map(([key, group]) => { const [baseRole, isFormerStr] = key.split('_'); const isFormer = isFormerStr === 'true'; const names = formatNames(group); if (baseRole === '_noRole') return names; let displayRole = normalizeRole(baseRole, group.length); if (isFormer) displayRole = `Former ${displayRole}`; return `${names} • <span class="author-role">${displayRole}</span>`; }); let final; if (parts.length === 1) final = parts[0]; else if (parts.length === 2) final = parts.join(' and '); else final = `${parts.slice(0, -1).join(', ')}, and ${parts.slice(-1)}`; return `By ${final}`; }
function createInlineImageFigure(image) { const hasCaption = image.caption || image.credit; const placementClass = `placement--${image.placement.toLowerCase().replace(/\s+/g, '-')}`; let figureHTML = `<figure class="single-article-figure ${placementClass}"><img src="${image.file}" alt="${image.caption || 'Article image'}" class="single-article-image">`; if (hasCaption) { figureHTML += `<figcaption>${image.caption ? `<span class="caption-text">${image.caption}</span>` : ''}${image.credit ? `<span class="caption-credit">${image.credit}</span>` : ''}</figcaption>`; } figureHTML += `</figure>`; return figureHTML; }
function injectImagesIntoContent(content, images) { if (!images || images.length === 0) return { mainContent: content, bottomContent: '' }; const tempDiv = document.createElement('div'); tempDiv.innerHTML = content; let contentElements = Array.from(tempDiv.children); const topImages = images.filter(img => img.placement.startsWith('Top')); const bottomBlockImages = images.filter(img => img.placement === 'Bottom Center'); const bodyImages = images.filter(img => !img.placement.startsWith('Top') && img.placement !== 'Bottom Center'); const blockElementIndices = contentElements.map((el, i) => (['P', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'BLOCKQUOTE'].includes(el.tagName) ? i : -1)).filter(i => i !== -1); if (bodyImages.length > 0) { if (blockElementIndices.length > 0) { const interval = Math.max(1, Math.floor(blockElementIndices.length / (bodyImages.length + 1))); for (let i = bodyImages.length - 1; i >= 0; i--) { const targetBlockNumber = (i + 1) * interval; const cappedTargetBlock = Math.min(targetBlockNumber, blockElementIndices.length); const insertionPointIndex = blockElementIndices[cappedTargetBlock - 1] + 1; const figureHtml = createInlineImageFigure(bodyImages[i]); const figureWrapper = document.createElement('div'); figureWrapper.innerHTML = figureHtml.trim(); if (figureWrapper.firstChild) contentElements.splice(insertionPointIndex, 0, figureWrapper.firstChild); } } else { const unplacedFigures = bodyImages.map(createInlineImageFigure); const figuresWrapper = document.createElement('div'); figuresWrapper.innerHTML = unplacedFigures.join(''); contentElements.push(...Array.from(figuresWrapper.children)); } } const topImagesHTML = topImages.map(createInlineImageFigure).join(''); const mainContentHTML = topImagesHTML + contentElements.map(el => el.outerHTML).join(''); const bottomContentHTML = bottomBlockImages.map(createInlineImageFigure).join(''); return { mainContent: mainContentHTML, bottomContent: bottomContentHTML }; }

function Comment(comment) {
    const isLoggedIn = getIsLoggedIn();
    const currentUser = getCurrentUser();
    const isAuthor = isLoggedIn && currentUser && currentUser.user_id === comment.author_id;

    const actionsHTML = isAuthor ? `
        <div class="comment-actions">
            <button class="comment-action-btn comment-edit-btn" data-comment-id="${comment.comment_id}" title="Edit comment">
                <img src="assets/icons/edit.svg" alt="Edit">
            </button>
            <button class="comment-action-btn comment-delete-btn" data-comment-id="${comment.comment_id}" title="Delete comment">
                <img src="assets/icons/delete.svg" alt="Delete">
            </button>
        </div>
    ` : '';

    const editFormId = `edit-textarea-${comment.comment_id}`;

    const commentAvatarHTML = CommentAvatar({
        author_name: comment.author_name || 'Anonymous',
        custom_avatar: comment.custom_avatar
    });

    return `
        <li id="comment-${comment.comment_id}">
            <div class="comment">
                ${commentAvatarHTML}
                <div class="comment-main">
                    <div class="comment-header">
                        <div>
                            <span class="comment-author">${comment.author_name}</span>
                            <span class="comment-timestamp">${formatTimeAgo(comment.timestamp)}</span>
                        </div>
                        ${actionsHTML}
                    </div>
                    <div class="comment-content" id="comment-content-${comment.comment_id}">${comment.content.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
                    <div class="comment-edit-form" id="comment-edit-form-${comment.comment_id}" style="display: none;">
                        <label for="${editFormId}" class="sr-only">Edit your comment</label>
                        <textarea class="comment-edit-textarea" id="${editFormId}" name="${editFormId}">${comment.content}</textarea>
                        <div class="comment-edit-actions">
                            <button class="button-secondary cancel-btn" data-comment-id="${comment.comment_id}">Cancel</button>
                            <button class="button-primary save-btn" data-comment-id="${comment.comment_id}">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    `;
}

function CommentSection(articleId) {
    const isLoggedIn = getIsLoggedIn();
    const currentUser = getCurrentUser();

    const commentFormHTML = isLoggedIn && currentUser ? `
        <form class="comment-form" id="comment-form" data-article-id="${articleId}">
            ${CommentAvatar(currentUser, true)}
            <div class="comment-form-main">
                <textarea id="comment-content" placeholder="Write a comment as ${currentUser.username}..." required maxlength="500"></textarea>
                <div class="comment-form-actions">
                    <span class="char-counter" id="char-counter">500</span>
                    <button type="submit" id="comment-submit-btn" class="button-primary" disabled>Post Comment</button>
                </div>
            </div>
        </form>
    ` : `
        <div class="login-prompt-for-comments">
            <p><a href="#login" onclick="sessionStorage.setItem('returnToAfterAuth', location.hash)">Log in</a> or <a href="#signup" onclick="sessionStorage.setItem('returnToAfterAuth', location.hash)">sign up</a> to leave a comment.</p>
        </div>
    `;

    return `
        <section class="comments-section">
            <div class="comments-header">
                <h3>Comments</h3>
                <span class="comment-count" id="comment-count-display"></span>
            </div>
            ${commentFormHTML}
            <ul id="comment-list"></ul>
        </section>
    `;
}

function createHTML(article, recommendedArticles) {
    const { writers, tags, category, date, title, description, content, images, id } = article;
    const tagListHTML = (tags && tags.length > 0) ? `<div class="tag-list">${tags.map(tag => `<a href="#search/${encodeURIComponent(tag)}" class="tag-item">${tag}</a>`).join('')}</div>` : '';
    const authorMetaTopHTML = (writers && writers.length > 0) ? `<div class="single-article-meta-top">${AvatarStack(writers, { compact: false })}<span class="author-byline">${createAuthorLineHTML(writers)}</span></div>` : '';
    let authorBiosContainer = '';
    const currentStaffForBio = writers.filter(w => w.isCurrentStaff && w.bio);
    if (currentStaffForBio.length > 0) {
        const authorProfilesHTML = currentStaffForBio.map(writer => `<div class="author-profile"><img src="${writer.image}" alt="${writer.name}"><div><h4>About ${writer.name}</h4><p>${writer.bio}</p></div></div>`).join('<hr class="author-separator">');
        authorBiosContainer = `<div class="author-bios-container">${authorProfilesHTML}</div>`;
    }
    const { mainContent, bottomContent } = injectImagesIntoContent(content, images);
    const likedClass = article.user_has_liked ? 'liked' : '';
    const bookmarkedClass = article.user_has_bookmarked ? 'bookmarked' : '';
    const moreLikeThisHTML = MoreLikeThisSection(recommendedArticles);

    return `
        <section class="page" id="single-article-page">
            <div class="container">
                <div class="single-article-wrapper">
                    <div class="article-meta-bar"><span class="category">${category}</span><span class="date">${date}</span></div>
                    <header class="single-article-header">
                        <h1>${title}</h1>
                        <p class="single-article-description">${description}</p>
                        <div class="article-interactions">
                            <button class="interaction-btn like-btn ${likedClass}" data-article-id="${id}">👍 <span class="like-count">${article.likes}</span> <span class="like-text">${article.likes === 1 ? 'Like' : 'Likes'}</span></button>
                            <button class="interaction-btn comment-scroll-btn" id="comment-scroll-btn">💬 <span id="top-comment-count">0</span> <span id="top-comment-text">Comments</span></button>
                            <button class="interaction-btn bookmark-btn ${bookmarkedClass}" data-article-id="${id}">🔖 <span class="bookmark-text">${article.user_has_bookmarked ? 'Bookmarked' : 'Bookmark'}</span></button>
                        </div>
                        ${SocialShare(article, { variant: 'minimal' })}
                    </header>
                    ${tagListHTML}
                    ${authorMetaTopHTML}
                    <div class="single-article-content">
                        ${mainContent}
                        ${bottomContent}
                        ${SocialShare(article, { variant: 'full' })}
                        ${authorBiosContainer}
                        ${moreLikeThisHTML}
                        ${CommentSection(id)}
                    </div>
                </div>
            </div>
        </section>
    `;
}

function updateCommentCount(count) {
    const displayHeader = document.getElementById('comment-count-display');
    const displayTopBtn = document.getElementById('top-comment-count');
    const textTopBtn = document.getElementById('top-comment-text');

    if (displayHeader) {
        if (count === 0) {
            displayHeader.textContent = '';
        } else {
            displayHeader.textContent = `(${count})`;
        }
    }
    if (displayTopBtn && textTopBtn) {
        displayTopBtn.textContent = count;
        textTopBtn.textContent = count === 1 ? 'Comment' : 'Comments';
    }
}

function attachCommentFormListeners() {
    const form = document.getElementById('comment-form');
    if (!form) return;

    const articleId = form.dataset.articleId;
    const contentInput = document.getElementById('comment-content');
    const submitBtn = document.getElementById('comment-submit-btn');
    const charCounter = document.getElementById('char-counter');
    const commentList = document.getElementById('comment-list');
    const MAX_CHARS = 500;

    function validateForm() {
        submitBtn.disabled = !(contentInput.value.trim().length > 0);
    }

    contentInput.addEventListener('input', () => {
        validateForm();
        const remaining = MAX_CHARS - contentInput.value.length;
        charCounter.textContent = remaining;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Posting...';

        const newComment = await postComment(articleId, contentInput.value.trim());

        if (newComment) {
            const newCommentHTML = Comment(newComment);
            commentList.insertAdjacentHTML('afterbegin', newCommentHTML);

            const currentCount = (commentList.children.length);
            updateCommentCount(currentCount);
            contentInput.value = '';
            charCounter.textContent = MAX_CHARS;
            showSuccess('Comment posted successfully!');
            showConfetti();
        } else {
            showError('Failed to post comment. You may need to log in again.');
        }
        submitBtn.textContent = 'Post Comment';
        validateForm();
    });
}

async function loadComments(articleId) {
    const commentList = document.getElementById('comment-list');
    if (!commentList) return;

    const comments = await getComments(articleId);
    commentList.innerHTML = comments.map(Comment).join('');
    updateCommentCount(comments.length);

    attachCommentActionListeners();
}

function attachCommentActionListeners() {
    const commentList = document.getElementById('comment-list');
    if (!commentList) return;

    commentList.addEventListener('click', async (e) => {
        const editBtn = e.target.closest('.comment-edit-btn');
        if (editBtn) {
            const commentId = editBtn.dataset.commentId;
            showEditForm(commentId);
            return;
        }
        const deleteBtn = e.target.closest('.comment-delete-btn');
        if (deleteBtn) {
            const commentId = deleteBtn.dataset.commentId;
            if (confirm('Are you sure you want to delete this comment?')) {
                await handleDeleteComment(commentId);
            }
            return;
        }
        const saveBtn = e.target.closest('.save-btn');
        if (saveBtn) {
            const commentId = saveBtn.dataset.commentId;
            await handleSaveComment(commentId);
            return;
        }
        const cancelBtn = e.target.closest('.cancel-btn');
        if (cancelBtn) {
            const commentId = cancelBtn.dataset.commentId;
            hideEditForm(commentId);
            return;
        }
    });
}

function showEditForm(commentId) {
    const commentMain = document.querySelector(`#comment-${commentId} .comment-main`);
    commentMain.querySelector('.comment-content').style.display = 'none';
    commentMain.querySelector('.comment-header .comment-actions').style.display = 'none';
    commentMain.querySelector('.comment-edit-form').style.display = 'block';
}

function hideEditForm(commentId) {
    const commentMain = document.querySelector(`#comment-${commentId} .comment-main`);
    commentMain.querySelector('.comment-content').style.display = 'block';
    const actions = commentMain.querySelector('.comment-header .comment-actions');
    if(actions) actions.style.display = 'flex';
    commentMain.querySelector('.comment-edit-form').style.display = 'none';
}

async function handleSaveComment(commentId) {
    const editForm = document.getElementById(`comment-edit-form-${commentId}`);
    const textarea = editForm.querySelector('.comment-edit-textarea');
    const newContent = textarea.value.trim();

    if (!newContent) {
        showWarning('Comment cannot be empty.');
        return;
    }

    const updatedComment = await editComment(commentId, newContent);
    if (updatedComment) {
        const contentDiv = document.getElementById(`comment-content-${commentId}`);
        contentDiv.innerHTML = newContent.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        hideEditForm(commentId);
        showSuccess('Comment updated successfully!');
    } else {
        showError('Failed to update comment. Please try again.');
    }
}

async function handleDeleteComment(commentId) {
    const result = await deleteComment(commentId);
    if (result) {
        const commentElement = document.getElementById(`comment-${commentId}`);
        commentElement.remove();
        const currentCount = document.getElementById('comment-list').children.length;
        updateCommentCount(currentCount);
        showSuccess('Comment deleted successfully.');
    } else {
        showError('Failed to delete comment. Please try again.');
    }
}

export async function render(container, articleId) {
    const { articles } = await getCombinedData();
    const article = articles.find(a => a.id == articleId);

    if (article) {
        const recommendedArticles = getRecommendedArticles(article, articles);
        container.innerHTML = createHTML(article, recommendedArticles);

        handleScrollPositioning(articleId);
        attachCommentFormListeners();

        if (getIsLoggedIn()) {
            trackArticleView(articleId);
        }

        const likeBtn = container.querySelector('.like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', async () => {
                if (!getIsLoggedIn()) {
                    showWarning('Please log in to like articles.');
                    sessionStorage.setItem('returnToAfterAuth', location.hash);
                    location.hash = '#login';
                    return;
                }
                const isCurrentlyLiked = likeBtn.classList.contains('liked');
                const result = await likeArticle(article.id, !isCurrentlyLiked);
                if (result) {
                    likeBtn.querySelector('.like-count').textContent = result.likes;
                    likeBtn.querySelector('.like-text').textContent = result.likes === 1 ? 'Like' : 'Likes';
                    likeBtn.classList.toggle('liked', result.user_has_liked);
                    if (result.user_has_liked) {
                        showConfetti();
                    }
                } else {
                    showError('Action failed. Please try again.');
                }
            });
        }

        const bookmarkBtn = container.querySelector('.bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', async () => {
                if (!getIsLoggedIn()) {
                    showWarning('Please log in to bookmark articles.');
                    sessionStorage.setItem('returnToAfterAuth', location.hash);
                    location.hash = '#login';
                    return;
                }
                const isCurrentlyBookmarked = bookmarkBtn.classList.contains('bookmarked');
                const result = await bookmarkArticle(article.id, !isCurrentlyBookmarked);
                if (result) {
                    bookmarkBtn.querySelector('.bookmark-text').textContent = result.user_has_bookmarked ? 'Bookmarked' : 'Bookmark';
                    bookmarkBtn.classList.toggle('bookmarked', result.user_has_bookmarked);
                    showSuccess(result.user_has_bookmarked ? 'Article bookmarked!' : 'Bookmark removed!');
                } else {
                    showError('Action failed. Please try again.');
                }
            });
        }

        const commentScrollBtn = container.querySelector('#comment-scroll-btn');
        const commentsSection = container.querySelector('.comments-section');
        if (commentScrollBtn && commentsSection) {
            commentScrollBtn.addEventListener('click', () => {
                commentsSection.scrollIntoView({ behavior: 'smooth' });
            });
        }

        loadComments(articleId);
    } else {
        if (scrollListener) {
            window.removeEventListener('beforeunload', scrollListener);
            scrollListener = null;
        }
        container.innerHTML = `<div class="container page"><p>Article not found.</p></div>`;
    }
}