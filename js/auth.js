import { invalidateCache } from './api.js';
import { Avatar } from './components/common/Avatar.js';

let currentUser = null;
let isLoggedIn = false;
let authChecked = false;

function generateUserGradient(username) {
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const color1 = `hsl(${hash % 360}, 70%, 60%)`;
    const color2 = `hsl(${(hash * 1.5) % 360}, 70%, 60%)`;
    return `linear-gradient(to right, ${color1}, ${color2})`;
}

export function updateCurrentUser(newUser) {
    if (isLoggedIn && newUser) {
        currentUser = newUser;
        invalidateCache();
    }
}

export async function login(username, password) {
    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            isLoggedIn = true;
            currentUser = data;
            invalidateCache();
            updateAuthUI();
            return { success: true, currentHash: location.hash };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        return { success: false, error: 'Could not connect to the server.' };
    }
}
export async function signup(username, password) {
    try {
        const response = await fetch('/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            isLoggedIn = true;
            currentUser = data;
            invalidateCache();
            updateAuthUI();
            return { success: true, currentHash: location.hash };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        return { success: false, error: 'Could not connect to the server.' };
    }
}

export async function checkLoginStatus() {
    if (authChecked) return;
    try {
        const response = await fetch('/api/users/status');
        const data = await response.json();
        if (data.loggedIn) {
            isLoggedIn = true;
            currentUser = data.user;
        } else {
            isLoggedIn = false;
            currentUser = null;
        }
        authChecked = true;
        updateAuthUI();
    } catch (error) {
        console.error('Error checking login status:', error);
        isLoggedIn = false;
        currentUser = null;
        authChecked = true;
    }
}

export function updateAuthUI() {
    const authStatusContainer = document.getElementById('auth-status');
    const authBtnMobileContainer = document.getElementById('auth-btn-mobile');

    document.body.classList.toggle('user-is-logged-in', isLoggedIn);

    if (authStatusContainer) {
        // Clear existing content
        authStatusContainer.innerHTML = '';

        if (isLoggedIn && currentUser) {
            const avatarHTML = Avatar({
                username: currentUser.username,
                customAvatar: currentUser.custom_avatar,
                size: 'small',
                className: 'header-avatar'
            });

            const myAccountLink = document.createElement('a');
            myAccountLink.href = '#account';
            myAccountLink.className = 'button-secondary';
            myAccountLink.textContent = 'My Account';

            const avatarLink = document.createElement('a');
            avatarLink.href = '#account';
            avatarLink.title = 'My Account';
            avatarLink.className = 'header-avatar-link';

            const parser = new DOMParser();
            const avatarNode = parser.parseFromString(avatarHTML, 'text/html').body.firstChild;
            avatarLink.appendChild(avatarNode);

            authStatusContainer.appendChild(myAccountLink);
            authStatusContainer.appendChild(avatarLink);

        } else {
            const loginLink = document.createElement('a');
            loginLink.href = '#login';
            loginLink.className = 'button-secondary';
            loginLink.textContent = 'Log In';
            authStatusContainer.appendChild(loginLink);
        }
    }

    if (authBtnMobileContainer) {
        // Clear existing content
        authBtnMobileContainer.innerHTML = '';
        if (isLoggedIn && currentUser) {
            const myAccountLink = document.createElement('a');
            myAccountLink.href = '#account';
            myAccountLink.className = 'button-secondary';
            myAccountLink.textContent = 'My Account';
            authBtnMobileContainer.appendChild(myAccountLink);
        } else {
            const loginLink = document.createElement('a');
            loginLink.href = '#login';
            loginLink.className = 'button-secondary';
            loginLink.textContent = 'Log In';
            authBtnMobileContainer.appendChild(loginLink);
        }
    }
}

export async function handleLogout() {
    try {
        await fetch('/api/users/logout', { method: 'POST' });
        isLoggedIn = false;
        currentUser = null;
        invalidateCache();
        updateAuthUI();
        location.hash = '#';
        location.reload();
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

export function getCurrentUser() { return currentUser; }
export function getIsLoggedIn() { return isLoggedIn; }