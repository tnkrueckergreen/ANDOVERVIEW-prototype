
import { generateUserGradient } from '../../lib/avatarGenerator.js';

export function Avatar({ 
    username, 
    customAvatar = null, 
    size = 'medium', 
    className = '', 
    attributes = {} 
}) {
    if (!username) {
        return '';
    }
    
    let style, content;
    if (customAvatar) {
        style = `background-image: url('${customAvatar}'); background-size: cover; background-position: center;`;
        content = '';
    } else {
        style = `background: ${generateUserGradient(username)};`;
        content = username.charAt(0).toUpperCase();
    }
    
    const attributeString = Object.entries(attributes)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');

    const classes = `avatar avatar--${size} ${className}`.trim();

    return `<div class="${classes}" style="${style}" ${attributeString}>${content}</div>`;
}

export function AccountAvatar(user) {
    return Avatar({
        username: user.username,
        customAvatar: user.customAvatar || user.custom_avatar,
        size: 'large',
        className: 'account-avatar',
        attributes: { id: 'account-avatar' }
    });
}

export function CommentAvatar(user, isForm = false) {
    return Avatar({
        username: user.username || user.author_name,
        customAvatar: user.customAvatar || user.custom_avatar,
        size: 'medium',
        className: isForm ? 'comment-form-avatar' : 'comment-avatar'
    });
}
