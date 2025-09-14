const express = require('express');
const bcrypt = require('bcrypt');
const { initializeDatabase } = require('./database');

const router = express.Router();
const saltRounds = 10;

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'You must be logged in to perform this action.' });
    }
};

router.put('/username', isAuthenticated, async (req, res) => {
    const db = await initializeDatabase();
    const { newUsername } = req.body;
    const { user_id, username: oldUsername } = req.session.user;

    if (!newUsername || newUsername.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
    }

    try {
        const existingUser = await db.get('SELECT user_id FROM users WHERE username = ? AND user_id != ?', newUsername, user_id);
        if (existingUser) {
            return res.status(409).json({ error: 'That username is already taken.' });
        }
        
        await Promise.all([
             db.run('UPDATE users SET username = ? WHERE user_id = ?', newUsername, user_id),
             db.run('UPDATE comments SET author_name = ? WHERE author_id = ?', newUsername, user_id)
        ]);
        
        const updatedUser = await db.get('SELECT user_id, username, custom_avatar FROM users WHERE user_id = ?', user_id);
        
        req.session.user = updatedUser;

        res.status(200).json({ success: true, user: updatedUser });
    
    } catch (error) {
        console.error('Username change error:', error);
        res.status(500).json({ error: 'An error occurred while changing your username.' });
    }
});

router.put('/password', isAuthenticated, async (req, res) => {
    const db = await initializeDatabase();
    const { currentPassword, newPassword } = req.body;
    const { user_id } = req.session.user;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    try {
        const user = await db.get('SELECT password_hash FROM users WHERE user_id = ?', user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const match = await bcrypt.compare(currentPassword, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Incorrect current password.' });
        }

        const new_password_hash = await bcrypt.hash(newPassword, saltRounds);
        await db.run('UPDATE users SET password_hash = ? WHERE user_id = ?', new_password_hash, user_id);

        res.status(200).json({ success: true, message: 'Password updated successfully.' });

    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ error: 'An error occurred while changing your password.' });
    }
});


router.post('/signup', async (req, res) => {
    const db = await initializeDatabase();
    const { username, password } = req.body;
    if (!username || !password || password.length < 6) {
        return res.status(400).json({ error: 'Username and a password of at least 6 characters are required.' });
    }
    try {
        const existingUser = await db.get('SELECT * FROM users WHERE username = ?', username);
        if (existingUser) {
            return res.status(409).json({ error: 'Username already taken.' });
        }
        const password_hash = await bcrypt.hash(password, saltRounds);
        const result = await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', username, password_hash);
        const user = { user_id: result.lastID, username: username, custom_avatar: null };
        req.session.user = user;
        res.status(201).json(user);
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'An error occurred during signup.' });
    }
});

router.post('/login', async (req, res) => {
    const db = await initializeDatabase();
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    try {
        const user = await db.get('SELECT * FROM users WHERE username = ?', username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }
        const userSessionData = { user_id: user.user_id, username: user.username, custom_avatar: user.custom_avatar };
        req.session.user = userSessionData;
        res.status(200).json(userSessionData);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out.' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully.' });
    });
});

router.get('/status', async (req, res) => {
    if (req.session.user) {
        const db = await initializeDatabase();
        try {
            const user = await db.get('SELECT user_id, username, custom_avatar FROM users WHERE user_id = ?', req.session.user.user_id);
            if (user) {
                req.session.user = user;
                res.status(200).json({ loggedIn: true, user });
            } else {
                req.session.destroy();
                res.status(200).json({ loggedIn: false });
            }
        } catch (error) {
            console.error('Error fetching user status:', error);
            res.status(500).json({ loggedIn: false, error: 'Failed to fetch user status' });
        }
    } else {
        res.status(200).json({ loggedIn: false });
    }
});

router.delete('/delete', isAuthenticated, async (req, res) => {
    const db = await initializeDatabase();
    const { user_id } = req.session.user;
    try {
        await db.run('DELETE FROM users WHERE user_id = ?', user_id);
        req.session.destroy(err => {
            if (err) {
                console.error('Session destruction failed after account deletion:', err);
                res.status(200).json({ message: 'Account deleted, but session could not be cleared automatically.' });
            } else {
                res.clearCookie('connect.sid');
                res.status(200).json({ message: 'Account deleted successfully.' });
            }
        });
    } catch (error) {
        console.error('Account deletion error:', error);
        res.status(500).json({ error: 'An error occurred during account deletion.' });
    }
});

module.exports = router;