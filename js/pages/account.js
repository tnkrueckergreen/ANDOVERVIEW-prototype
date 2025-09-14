import { getIsLoggedIn, handleLogout, updateCurrentUser, getCurrentUser, updateAuthUI } from '../auth.js';
import { getAccountData, deleteAccount, getCombinedData, changeUsername, changePassword } from '../api.js';
import { showError, showSuccess, showWarning } from '../lib/toast.js';
import { generateUserGradient } from '../lib/avatarGenerator.js';
import { AccountAvatar } from '../components/common/Avatar.js';
import { initPasswordToggle } from '../lib/passwordToggle.js';

function updatePageAvatars(user) {
    const newAvatarHTML = AccountAvatar(user);

    const headerAvatar = document.querySelector('.account-header .account-avatar');
    if (headerAvatar) {
        headerAvatar.outerHTML = newAvatarHTML;
    }

    const settingsAvatarContainer = document.getElementById('avatar-display-container');
    if (settingsAvatarContainer) {
        settingsAvatarContainer.innerHTML = newAvatarHTML;
    }
}

function pluralize(count, singular, plural) {
    return count === 1 ? singular : plural;
}

function AccountArticleCard(article) {
    const authorText = article.writers && article.writers.length > 0 ? `By ${article.writers.map(w => w.name).join(', ')}` : '';
    const placeholderImage = 'assets/icons/placeholder-image.png';
    return `
        <div class="account-article-card">
            <a href="#single-article-page/${article.id}">
                <img src="${article.image || placeholderImage}" alt="">
            </a>
            <div class="account-article-info">
                <div class="category">${article.category}</div>
                <h3><a href="#single-article-page/${article.id}">${article.title}</a></h3>
                <div class="author">${authorText}</div>
            </div>
        </div>
    `;
}

function createHTML(data, likedArticles, bookmarkedArticles, viewedArticles) {
    if (!data) {
        return `<section class="page account-page"><div class="container"><p>Loading your dashboard...</p></div></section>`;
    }

    const { username, joinDate, stats, comments, customAvatar } = data;
    const formattedJoinDate = new Date(joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const capitalizedUsername = username.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

    const accountAvatarHTML = AccountAvatar({ username, customAvatar });

    const emptyComments = `<div class="empty-state"><p>You haven't shared your thoughts yet. Find an article and join the conversation!</p><a href="#articles-page-all" class="button-secondary">Browse Articles</a></div>`;
    const emptyLikes = `<div class="empty-state"><p>Show your appreciation for an article by liking it!</p><a href="#articles-page-all" class="button-secondary">Find Articles to Like</a></div>`;
    const emptyBookmarks = `<div class="empty-state"><p>Save articles for later by bookmarking them.</p><a href="#articles-page-all" class="button-secondary">Browse Articles</a></div>`;

    const commentsHTML = comments.length > 0 ? comments.map(c => `<li><div class="comment-item-content">${c.content}</div><p class="activity-item-meta">On <a href="#single-article-page/${c.article_id}">an article</a> • ${new Date(c.timestamp).toLocaleDateString()}</p></li>`).join('') : `<li>${emptyComments}</li>`;
    const likedArticlesHTML = likedArticles.length > 0 ? likedArticles.map(AccountArticleCard).join('') : `<li>${emptyLikes}</li>`;
    const bookmarkedArticlesHTML = bookmarkedArticles.length > 0 ? bookmarkedArticles.map(AccountArticleCard).join('') : `<li>${emptyBookmarks}</li>`;
    const recentlyViewedHTML = viewedArticles.length > 0 ? viewedArticles.map(AccountArticleCard).join('') : `<div class="empty-state"><p>The articles you read will appear here.</p></div>`;

    return `
        <section class="page account-page">
            <div class="container">
                <header class="account-header">
                    ${accountAvatarHTML}
                    <div class="account-header-info">
                        <h1 id="account-welcome-heading">Welcome back, ${capitalizedUsername}!</h1>
                        <p>Member since ${formattedJoinDate}</p>
                    </div>
                </header>

                <div class="account-tabs">
                    <ul class="account-nav" id="account-nav">
                        <li><button class="account-nav-btn active" data-tab="dashboard">Dashboard</button></li>
                        <li><button class="account-nav-btn" data-tab="comments">My Comments</button></li>
                        <li><button class="account-nav-btn" data-tab="bookmarks">Bookmarked</button></li>
                        <li><button class="account-nav-btn" data-tab="likes">Liked</button></li>
                        <li><button class="account-nav-btn" data-tab="settings">Settings</button></li>
                    </ul>

                    <div class="account-tab-content">
                        <div id="dashboard-tab" class="tab-pane active">
                            <div class="account-card">
                                <h2>At a Glance</h2>
                                <div class="stats-grid">
                                    <div class="stat-item"><div class="stat-icon-wrapper"><div class="stat-icon" data-icon="view"></div></div><div class="stat-value">${stats.articlesViewed}</div><div class="stat-label">${pluralize(stats.articlesViewed, 'Article Viewed', 'Articles Viewed')}</div></div>
                                    <div class="stat-item"><div class="stat-icon-wrapper"><div class="stat-icon" data-icon="like"></div></div><div class="stat-value">${stats.likes}</div><div class="stat-label">${pluralize(stats.likes, 'Article Liked', 'Articles Liked')}</div></div>
                                    <div class="stat-item"><div class="stat-icon-wrapper"><div class="stat-icon" data-icon="bookmark"></div></div><div class="stat-value">${stats.bookmarks}</div><div class="stat-label">${pluralize(stats.bookmarks, 'Article Bookmarked', 'Articles Bookmarked')}</div></div>
                                    <div class="stat-item"><div class="stat-icon-wrapper"><div class="stat-icon" data-icon="comment"></div></div><div class="stat-value">${stats.comments}</div><div class="stat-label">${pluralize(stats.comments, 'Comment Made', 'Comments Made')}</div></div>
                                </div>
                            </div>
                            <div class="account-card"><h2>Jump Back In</h2><ul class="activity-list">${recentlyViewedHTML}</ul></div>
                        </div>
                        <div id="comments-tab" class="tab-pane"><div class="account-card"><h2>My ${pluralize(comments.length, 'Comment', 'Comments')}</h2><ul class="activity-list">${commentsHTML}</ul></div></div>
                        <div id="bookmarks-tab" class="tab-pane"><div class="account-card"><h2>${pluralize(bookmarkedArticles.length, 'Bookmarked Article', 'Bookmarked Articles')}</h2><ul class="activity-list">${bookmarkedArticlesHTML}</ul></div></div>
                        <div id="likes-tab" class="tab-pane"><div class="account-card"><h2>${pluralize(likedArticles.length, 'Liked Article', 'Liked Articles')}</h2><ul class="activity-list">${likedArticlesHTML}</ul></div></div>

                        <div id="settings-tab" class="tab-pane">
                            <div class="account-card">
                                <h2>Account Settings</h2>

                                <div class="settings-section" id="avatar-section">
                                    <div class="settings-info">
                                        <h3>Profile Avatar</h3>
                                        <p>Upload a custom profile picture for your account.</p>
                                    </div>
                                    <div class="avatar-setting-container">
                                        <div id="avatar-display-container">
                                            ${AccountAvatar({ username, customAvatar })}
                                        </div>
                                        <div class="avatar-actions">
                                            <div id="avatar-actions-default">
                                                <button class="button-secondary" id="change-avatar-btn">Change Photo</button>
                                                ${customAvatar ? `<button class="button-secondary" id="remove-avatar-btn">Remove</button>` : ''}
                                            </div>
                                            <div id="avatar-actions-editing" style="display: none;">
                                                <button class="button-secondary" id="cancel-avatar-btn">Cancel</button>
                                                <button class="button-primary" id="save-avatar-btn">Save Changes</button>
                                            </div>
                                        </div>
                                    </div>
                                    <form id="avatar-form" style="display: none;">
                                        <input type="file" id="avatar-file" name="avatar" accept="image/jpeg,image/png">
                                    </form>
                                </div>

                                <div class="settings-section" data-section="username">
                                    <div class="settings-info">
                                        <h3>Username</h3>
                                        <p>Your current username is <strong>${username}</strong>.</p>
                                    </div>
                                    <div class="settings-actions">
                                        <button class="button-secondary change-btn" data-form-type="username">Change</button>
                                    </div>
                                    <form class="edit-form" id="username-form">
                                        <div class="form-group">
                                            <label for="new-username">New Username</label>
                                            <input type="text" id="new-username" name="new-username" value="${username}" required minlength="3">
                                        </div>
                                        <div class="edit-form-actions">
                                            <button type="button" class="button-secondary cancel-btn" data-form-type="username">Cancel</button>
                                            <button type="submit" class="button-primary">Save Changes</button>
                                        </div>
                                    </form>
                                </div>

                                <div class="settings-section" data-section="password">
                                    <div class="settings-info"><h3>Password</h3><p>Update your password regularly to keep your account secure.</p></div>
                                    <div class="settings-actions"><button class="button-secondary change-btn" data-form-type="password">Change</button></div>
                                    <form class="edit-form" id="password-form">
                                        <input type="hidden" name="username" value="${username}" autocomplete="username">
                                        <div class="form-group">
                                            <label for="current-password">Current Password</label>
                                            <div class="password-input-wrapper">
                                                <input type="password" id="current-password" name="current-password" required autocomplete="current-password">
                                                <button type="button" class="password-toggle-btn" aria-label="Show password">
                                                    <img src="assets/icons/eye-slash.svg" alt="Toggle password visibility">
                                                </button>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="new-password">New Password</label>
                                            <div class="password-input-wrapper">
                                                <input type="password" id="new-password" name="new-password" required minlength="6" autocomplete="new-password">
                                                <button type="button" class="password-toggle-btn" aria-label="Show password">
                                                    <img src="assets/icons/eye-slash.svg" alt="Toggle password visibility">
                                                </button>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="confirm-password">Confirm New Password</label>
                                            <div class="password-input-wrapper">
                                                <input type="password" id="confirm-password" name="confirm-password" required minlength="6" autocomplete="new-password">
                                                <button type="button" class="password-toggle-btn" aria-label="Show password">
                                                    <img src="assets/icons/eye-slash.svg" alt="Toggle password visibility">
                                                </button>
                                            </div>
                                        </div>
                                        <div class="edit-form-actions">
                                            <button type="button" class="button-secondary cancel-btn" data-form-type="password">Cancel</button>
                                            <button type="submit" class="button-primary">Save Changes</button>
                                        </div>
                                    </form>
                                </div>

                                <div class="settings-section">
                                    <div class="settings-info">
                                        <h3>Log Out</h3>
                                        <p>You will be returned to the home page.</p>
                                    </div>
                                    <div class="settings-actions">
                                        <button id="logout-btn" class="button-secondary settings-btn">
                                            <img src="assets/icons/logout.svg" alt="" />
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                </div>

                                <div class="settings-section danger-zone">
                                    <div class="settings-info">
                                        <h3>Delete Account</h3>
                                        <p>Permanently delete your account and all associated data. This action is irreversible.</p>
                                    </div>
                                    <div class="settings-actions">
                                        <button id="delete-account-btn" class="button-primary settings-btn">
                                            <img src="assets/icons/delete.svg" alt="" />
                                            <span>Delete My Account</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function attachFormListeners() {
    const usernameForm = document.getElementById('username-form');
    if (usernameForm) {
        usernameForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newUsername = document.getElementById('new-username').value;
            const result = await changeUsername(newUsername);
            if (result.success) {
                showSuccess('Username updated successfully!');
                updateCurrentUser(result.user);
                updateAuthUI();

                const capitalized = result.user.username.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                document.getElementById('account-welcome-heading').textContent = `Welcome back, ${capitalized}!`;

                updatePageAvatars(result.user);

                document.querySelector('[data-section="username"] p strong').textContent = result.user.username;
                document.querySelector('[data-section="username"]').classList.remove('is-editing');
            } else {
                showError(result.error);
            }
        });
    }
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            if (newPassword !== confirmPassword) {
                showError('New passwords do not match.');
                return;
            }
            const result = await changePassword(currentPassword, newPassword);
            if (result.success) {
                showSuccess('Password updated successfully!');
                passwordForm.reset();
                document.querySelector('[data-section="password"]').classList.remove('is-editing');
            } else {
                showError(result.error);
            }
        });
        initPasswordToggle(passwordForm);
    }

    const avatarSection = document.getElementById('avatar-section');
    if (!avatarSection) return;

    const fileInput = document.getElementById('avatar-file');
    const avatarDisplayContainer = document.getElementById('avatar-display-container');
    const changeBtn = document.getElementById('change-avatar-btn');
    const cancelBtn = document.getElementById('cancel-avatar-btn');
    const saveBtn = document.getElementById('save-avatar-btn');
    const defaultActions = document.getElementById('avatar-actions-default');
    const editingActions = document.getElementById('avatar-actions-editing');

    let originalAvatarHTML = avatarDisplayContainer.innerHTML;

    changeBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            showError('File size must be less than 2MB');
            fileInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            avatarDisplayContainer.innerHTML = `<img src="${event.target.result}" alt="New avatar preview" class="avatar avatar--large account-avatar">`;
            defaultActions.style.display = 'none';
            editingActions.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    });

    cancelBtn.addEventListener('click', () => {
        avatarDisplayContainer.innerHTML = originalAvatarHTML;
        fileInput.value = '';
        defaultActions.style.display = 'flex';
        editingActions.style.display = 'none';
    });

    saveBtn.addEventListener('click', async () => {
        const formData = new FormData();
        const file = fileInput.files[0];
        if (!file) {
            showError('Please select an image file first.');
            return;
        }
        formData.append('avatar', file);

        try {
            const response = await fetch('/api/account/avatar', { method: 'POST', body: formData });
            const result = await response.json();

            if (response.ok) {
                showSuccess('Avatar updated successfully!');
                const newUser = { ...getCurrentUser(), custom_avatar: result.avatarUrl };
                updateCurrentUser(newUser);
                updateAuthUI();

                updatePageAvatars(newUser);
                originalAvatarHTML = document.getElementById('avatar-display-container').innerHTML;

                cancelBtn.click();

                if (!document.getElementById('remove-avatar-btn')) {
                    const removeBtnHTML = `<button class="button-secondary" id="remove-avatar-btn">Remove</button>`;
                    defaultActions.insertAdjacentHTML('beforeend', removeBtnHTML);
                    attachRemoveAvatarListener();
                }
            } else {
                showError(result.error || 'Failed to upload avatar.');
                cancelBtn.click();
            }
        } catch (error) {
            showError('Failed to upload avatar. Please try again.');
            cancelBtn.click();
        }
    });
}

function attachRemoveAvatarListener() {
    const defaultActions = document.getElementById('avatar-actions-default');
    if (defaultActions) {
        defaultActions.addEventListener('click', async (e) => {
            if (e.target.id !== 'remove-avatar-btn') return;
            const removeBtn = e.target;

            if (!confirm('Are you sure you want to remove your custom avatar?')) return;

            try {
                const response = await fetch('/api/account/avatar', { method: 'DELETE' });
                const result = await response.json();

                if (response.ok) {
                    showSuccess('Custom avatar removed!');
                    const currentUser = getCurrentUser();
                    if (currentUser) currentUser.custom_avatar = null;
                    updateAuthUI();

                    updatePageAvatars(currentUser);

                    removeBtn.remove();
                } else {
                    showError(result.error || 'Failed to remove avatar');
                }
            } catch (error) {
                showError('Failed to remove avatar. Please try again.');
            }
        });
    }
}


function attachEventListeners() {
    const nav = document.getElementById('account-nav');
    if (nav) {
        nav.addEventListener('click', (e) => {
            const tabBtn = e.target.closest('.account-nav-btn');
            if (!tabBtn) return;
            nav.querySelectorAll('.account-nav-btn').forEach(btn => btn.classList.remove('active'));
            tabBtn.classList.add('active');
            const targetTabId = `${tabBtn.dataset.tab}-tab`;
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.toggle('active', pane.id === targetTabId);
            });
        });
    }

    document.getElementById('settings-tab')?.addEventListener('click', (e) => {
        const changeBtn = e.target.closest('.change-btn');
        if (changeBtn) {
            changeBtn.closest('.settings-section').classList.add('is-editing');
        }
        const cancelBtn = e.target.closest('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.closest('.settings-section').classList.remove('is-editing');
        }
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    const deleteBtn = document.getElementById('delete-account-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            const confirmation = prompt('This action is irreversible. To confirm, please type "DELETE" in the box below.');
            if (confirmation === 'DELETE') {
                const result = await deleteAccount();
                if (result) {
                    showSuccess('Your account has been permanently deleted.');
                    setTimeout(() => location.reload(), 1500);
                } else {
                    showError('Could not delete account. Please try again.');
                }
            } else if (confirmation !== null) {
                showError('Deletion cancelled. Confirmation text did not match.');
            }
        });
    }

    attachFormListeners();
    attachRemoveAvatarListener();
}

export async function render(container) {
    if (!getIsLoggedIn()) {
        location.hash = '#login';
        return;
    }
    container.innerHTML = createHTML(null);
    const [accountData, siteData] = await Promise.all([getAccountData(), getCombinedData()]);

    if (!accountData || accountData.error) {
        showError('Could not load account data. Please log in again.');
        location.hash = '#login';
        return;
    }

    const getArticlesByIds = (ids) => {
        const idSet = new Set(ids);
        return siteData.articles.filter(article => idSet.has(article.id)).sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    const likedArticles = getArticlesByIds(accountData.likedArticleIds);
    const bookmarkedArticles = getArticlesByIds(accountData.bookmarkedArticleIds);
    const recentViewIds = [...accountData.viewedArticleIds].reverse().slice(0, 4);
    const viewedArticles = getArticlesByIds(recentViewIds);

    container.innerHTML = createHTML(accountData, likedArticles, bookmarkedArticles, viewedArticles);
    attachEventListeners();
}