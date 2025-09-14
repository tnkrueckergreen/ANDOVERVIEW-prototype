let cachedCombinedData = null;

export function invalidateCache() {
    cachedCombinedData = null;
}

export async function getCombinedData() {
    if (cachedCombinedData) {
        return cachedCombinedData;
    }
    try {
        const response = await fetch('/api/articles');
        if (!response.ok) {
            throw new Error(`Failed to fetch data from server: ${response.statusText}`);
        }
        const data = await response.json();
        if (typeof marked !== 'undefined') {
            marked.setOptions({ mangle: false, headerIds: false });
            data.articles.forEach(article => {
                article.description = marked.parseInline(article.rawDescription || '');
                const markdownContent = article.content || '';
                article.content = marked.parse(markdownContent);
            });
        }
        cachedCombinedData = data;
        return cachedCombinedData;
    } catch (error) {
        console.error("Could not fetch data:", error);
        return { articles: [], staff: [] };
    }
}

export async function changeUsername(newUsername) {
    try {
        const response = await fetch('/api/users/username', {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newUsername }),
        });
        const data = await response.json();
        if (!response.ok) return { success: false, error: data.error };
        return { success: true, user: data.user };
    } catch (error) {
        return { success: false, error: 'Could not connect to the server.' };
    }
}

export async function changePassword(currentPassword, newPassword) {
    try {
        const response = await fetch('/api/users/password', {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword }),
        });
        const data = await response.json();
        if (!response.ok) return { success: false, error: data.error };
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Could not connect to the server.' };
    }
}

export async function likeArticle(articleId, isLiking = true) {
    try {
        const response = await fetch(`/api/articles/${articleId}/like`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: isLiking ? 'like' : 'unlike' }),
        });
        if (!response.ok) throw new Error('Like request failed');
        return await response.json();
    } catch (error) {
        console.error('Failed to like/unlike article:', error);
        return null;
    }
}

export async function bookmarkArticle(articleId, isBookmarking = true) {
    try {
        const response = await fetch(`/api/articles/${articleId}/bookmark`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: isBookmarking ? 'bookmark' : 'unbookmark' }),
        });
        if (!response.ok) throw new Error('Bookmark request failed');
        return await response.json();
    } catch (error) {
        console.error('Failed to bookmark/unbookmark article:', error);
        return null;
    }
}

export async function getComments(articleId) {
    try {
        const response = await fetch(`/api/articles/${articleId}/comments`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        return await response.json();
    } catch (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
}

export async function postComment(articleId, content) {
    try {
        const response = await fetch(`/api/articles/${articleId}/comments`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });
        if (!response.ok) throw new Error('Failed to post comment');
        return await response.json();
    } catch (error) {
        console.error('Error posting comment:', error);
        return null;
    }
}

export async function editComment(commentId, content) {
    try {
        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content }),
        });
        if (!response.ok) throw new Error('Failed to edit comment');
        return await response.json();
    } catch (error) {
        console.error('Error editing comment:', error);
        return null;
    }
}

export async function deleteComment(commentId) {
    try {
        const response = await fetch(`/api/comments/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to delete comment');
        return await response.json();
    } catch (error) {
        console.error('Error deleting comment:', error);
        return null;
    }
}

export async function getAccountData() {
    try {
        const response = await fetch('/api/account/data', { credentials: 'include' });
        if (response.status === 401) return { error: 'Unauthorized' };
        if (!response.ok) throw new Error('Failed to fetch account data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching account data:', error);
        return null;
    }
}

export async function trackArticleView(articleId) {
    try {
        const response = await fetch(`/api/articles/${articleId}/view`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) throw new Error('Failed to track article view');
        return await response.json();
    } catch (error) {
        console.error('Error tracking article view:', error);
        return null;
    }
}

export async function deleteAccount() {
    try {
        const response = await fetch('/api/users/delete', {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to delete account');
        return await response.json();
    } catch (error) {
        console.error('Error deleting account:', error);
        return null;
    }
}