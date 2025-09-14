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
        if (isLoggedIn && currentUser) {
            const avatarHTML = Avatar({
                username: currentUser.username,
                customAvatar: currentUser.custom_avatar,
                size: 'small',
                className: 'header-avatar'
            });
            authStatusContainer.innerHTML = `
                <a href="#account" class="button-secondary">My Account</a>
                <a href="#account" title="My Account" class="header-avatar-link">${avatarHTML}</a>
            `;
        } else {
            authStatusContainer.innerHTML = `
                <a href="#login" class="button-secondary">Log In</a>
            `;
        }
    }

    if (authBtnMobileContainer) {
        if (isLoggedIn && currentUser) {
            authBtnMobileContainer.innerHTML = `<a href="#account" class="button-secondary">My Account</a>`;
        } else {
            authBtnMobileContainer.innerHTML = `<a href="#login" class="button-secondary">Log In</a>`;
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