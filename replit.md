# ANDOVERVIEW Dynamic - Project Documentation

## Overview
A modern, dynamic newspaper website prototype for ANDOVERVIEW with full backend functionality using Node.js/Express and SQLite. The project features user authentication, article management, commenting system, and responsive design.

## Recent Changes

### 🔒 Critical Security Fixes (September 14, 2025)
- **FIXED**: Unsafe static file serving that exposed entire repository including backend source code
- **FIXED**: Database file exposure (my-database.sqlite was publicly accessible)
- **IMPLEMENTED**: Secure whitelisted static file serving for only necessary frontend directories
- **ADDED**: Explicit blocking of `/backend/*` paths with 403 responses
- **SECURED**: Session secret moved to environment variable (SESSION_SECRET)
- **CONFIGURED**: Trust proxy settings for deployment readiness
- **TESTED**: All security measures verified working, frontend functionality maintained

**Security Test Results:**
- ✅ Index.html serves at root (200)
- ✅ CSS, JS, and assets serve correctly (200) 
- ✅ Backend files blocked (403)
- ✅ Database files blocked (403)
- ✅ Unwhitelisted directories blocked (404)

## Project Architecture

### Frontend Structure
- **Static Assets**: `/assets/` (images, icons, logos)
- **Stylesheets**: `/css/` (modular component-based CSS)
- **JavaScript**: `/js/` (modular ES6 components and utilities)
- **Entry Point**: `index.html` (single-page application)

### Backend Structure (Secure)
- **Server**: `backend/server.js` (Express server with security middleware)
- **Database**: `backend/database.js` (SQLite with user/article/comment models)
- **API Routes**: `backend/api-router.js` & `backend/auth-router.js`
- **Content**: `backend/content-parser.js` (article processing)

### Security Features
- Whitelisted static file serving (only `/assets`, `/css`, `/js`)
- Protected backend source code and database
- Environment-based session secrets
- Secure cookie configuration
- Trust proxy configuration for deployments

### Database Schema
- **Users**: Authentication with custom avatars
- **Articles**: Like counts and metadata
- **Comments**: Threaded commenting system with foreign keys

## User Preferences
- **Coding Style**: Modular architecture with separated concerns
- **Security**: Prioritize secure defaults and environment-based configuration
- **Performance**: Efficient static file serving and database queries
- **Maintainability**: Clear separation between frontend and backend code

## Deployment Notes
- Server binds to `0.0.0.0:5000` for Replit compatibility
- Uses environment variables for sensitive configuration
- Trust proxy configured for production deployments
- Secure session management with httpOnly cookies