# ANDOVERVIEW Dynamic

A modern, full-featured student newspaper website with dynamic content management, user authentication, and interactive features.

## Overview

ANDOVERVIEW Dynamic is a complete web application built for student journalism, featuring a robust backend API, user management system, and an intuitive single-page application frontend. The platform supports article publishing, user comments, subscriptions, and comprehensive content management.

## Features

### Core Functionality
- **Article Management**: Browse articles by category, author, or publication date
- **User Authentication**: Secure signup, login, and session management
- **Interactive Comments**: Threaded commenting system with user engagement
- **Search & Discovery**: Full-text search across articles and content
- **User Profiles**: Custom avatars and personalized account management
- **Newsletter Subscription**: Email subscription system for updates
- **Responsive Design**: Mobile-first, responsive layout for all devices

### Content Features
- **Multiple Categories**: Community, Sports, Arts, Reviews, Opinion, Editorial
- **Author Pages**: Dedicated pages for journalist profiles
- **Issue Archives**: Organized publication issues
- **News Ticker**: Real-time scrolling news updates
- **Featured Articles**: Highlighted content on homepage
- **Like & Bookmark System**: User engagement tracking

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite3** - Database for persistent storage
- **bcrypt** - Password hashing and security
- **express-session** - Session management
- **multer** - File upload handling

### Frontend
- **Vanilla JavaScript** - ES6 modules and modern JavaScript
- **CSS3** - Modular, component-based stylesheets
- **HTML5** - Semantic markup and accessibility
- **Single-Page Application** - Client-side routing

### Security
- **Environment Variables** - Secure configuration management
- **Whitelisted Static Serving** - Protected backend source code
- **Session Security** - Secure cookie configuration
- **Input Validation** - SQL injection and XSS protection

## Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Setup Instructions

1. **Clone or access the project**
   ```bash
   # If downloading, extract to your desired directory
   cd andoverview-dynamic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   SESSION_SECRET=your-secure-session-secret-here
   PORT=5000
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Access the website**
   Open your browser and navigate to `http://localhost:5000`

## Usage

### For Readers
- Browse articles by category using the navigation menu
- Search for specific content using the search bar
- Create an account to comment on articles and save bookmarks
- Subscribe to the newsletter for updates
- View author profiles and their published works

### For Content Creators
- Sign up for an account to access commenting features
- Upload a custom avatar for your profile
- Engage with articles through comments and likes

### For Administrators
- Access the backend API for content management
- Monitor user engagement through the database
- Manage article content and user accounts

## Project Structure

```
andoverview-dynamic/
├── backend/                 # Server-side application
│   ├── server.js           # Main server entry point
│   ├── api-router.js       # API endpoints for articles/comments
│   ├── auth-router.js      # Authentication routes
│   ├── database.js         # Database initialization and queries
│   ├── content-parser.js   # Article content processing
│   └── my-database.sqlite  # SQLite database file
├── js/                     # Frontend JavaScript
│   ├── app.js             # Main application initialization
│   ├── router.js          # Client-side routing
│   ├── pages/             # Page-specific components
│   ├── components/        # Reusable UI components
│   └── lib/               # Utility functions and libraries
├── css/                    # Stylesheets
│   ├── main.css           # Main styles
│   └── components/        # Component-specific styles
├── assets/                 # Static assets (images, icons)
├── uploads/                # User-uploaded content
├── index.html              # Main HTML entry point
└── package.json            # Project dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout
- `GET /api/users/me` - Get current user profile

### Articles
- `GET /api/articles` - Retrieve all articles
- `GET /api/articles/:id` - Get specific article
- `POST /api/articles/:id/like` - Like/unlike article
- `POST /api/articles/:id/bookmark` - Bookmark article

### Comments
- `GET /api/articles/:id/comments` - Get article comments
- `POST /api/articles/:id/comments` - Add new comment

## Database Schema

### Users Table
- User authentication and profile information
- Avatar upload support
- Session management

### Articles Table
- Article metadata and content
- Category and author information
- Like counts and engagement metrics

### Comments Table
- Threaded commenting system
- User association and timestamps
- Foreign key relationships

## Security Features

- **Protected Backend**: Source code and database files are not publicly accessible
- **Environment Configuration**: Sensitive data stored in environment variables
- **Session Security**: Secure cookie configuration with httpOnly flags
- **Input Validation**: Protection against SQL injection and XSS attacks
- **File Upload Security**: Restricted upload paths and file type validation

## Development

### Running in Development Mode
The application is configured to run on port 5000 with the following command:
```bash
npm start
```

### Environment Variables
Required environment variables for production:
- `SESSION_SECRET`: Secure session encryption key
- `PORT`: Server port (defaults to 5000)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Support

For questions, issues, or contributions, please contact the development team or create an issue in the project repository.

---

Built with ❤️ for student journalism and community engagement.