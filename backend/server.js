const express = require('express');
const path = require('path');
const session = require('express-session');
const compression = require('compression');
const { initializeDatabase } = require('./database');
const apiRouter = require('./api-router');
const authRouter = require('./auth-router');

const app = express();

const PORT = process.env.PORT || 5000;

// Configure trust proxy for deployment readiness
app.set('trust proxy', 1);

app.use(compression());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

initializeDatabase();

// Block access to sensitive backend paths
app.use('/backend*', (req, res) => {
    res.status(403).json({ error: 'Access denied' });
});

app.use('/api', apiRouter);
app.use('/api/users', authRouter);

const staticCacheOptions = {
    maxAge: '1y',
    immutable: true
};

// Secure static file serving - only serve specific whitelisted directories
app.use('/dist', express.static(path.join(__dirname, '../dist'), staticCacheOptions));
app.use('/assets', express.static(path.join(__dirname, '../assets'), staticCacheOptions));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve index.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running and listening on 0.0.0.0:${PORT}`);
});
