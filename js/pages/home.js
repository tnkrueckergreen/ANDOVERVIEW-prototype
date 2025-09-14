import { getCombinedData } from '../api.js';
import { FeaturedCard } from '../components/cards/FeaturedCard.js';
import { RecentCard } from '../components/cards/RecentCard.js';
import { renderList } from '../lib/template.js';

let resizeTimer;
const SCROLL_SPEED = 60;

function populateTicker(articles) {
    const tickerContainer = document.getElementById('news-ticker-container');
    const tickerWrap = tickerContainer?.querySelector('.ticker-wrap');
    const tickerList = tickerContainer?.querySelector('#news-ticker-list');

    if (!tickerContainer || !tickerWrap || !tickerList || articles.length === 0) return;

    const setupTicker = () => {
        tickerList.innerHTML = '';
        tickerList.classList.remove('is-animated');
        tickerList.style.animation = 'none';

        const originalGroup = document.createElement('div');
        originalGroup.classList.add('ticker-group');
        articles.slice(0, 8).forEach(article => {
            const link = document.createElement('a');
            link.href = `#single-article-page/${article.id}`;
            link.textContent = article.title;
            originalGroup.appendChild(link);
        });
        tickerList.appendChild(originalGroup);

        const containerWidth = tickerWrap.offsetWidth;
        const contentWidth = originalGroup.offsetWidth;

        if (contentWidth > containerWidth) {
            const clone = originalGroup.cloneNode(true);
            tickerList.appendChild(clone);
        } else {
            const copiesNeeded = Math.ceil((containerWidth * 2) / contentWidth);
            for (let i = 0; i < copiesNeeded; i++) {
                const clone = originalGroup.cloneNode(true);
                tickerList.appendChild(clone);
            }
        }

        const totalWidth = originalGroup.offsetWidth;
        const duration = totalWidth / SCROLL_SPEED;

        tickerList.style.setProperty('--scroll-width', `${totalWidth}px`);
        tickerList.style.setProperty('--scroll-duration', `${duration}s`);

        requestAnimationFrame(() => {
            tickerList.classList.add('is-animated');
            tickerList.style.animation = '';
        });
    };

    setupTicker();
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setupTicker, 250);
    });
}

function initTypewriterEffect() {
    const heading = document.querySelector('.typewriter-heading');
    if (!heading || heading.dataset.isTyped) return;

    const originalText = heading.textContent;
    heading.dataset.isTyped = 'true';
    heading.style.visibility = 'hidden';
    const finalHeight = heading.offsetHeight;
    heading.style.minHeight = `${finalHeight}px`;
    heading.innerHTML = '';
    heading.style.visibility = 'visible';

    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    heading.appendChild(cursor);

    let charIndex = 0;

    function typeCharacter() {
        if (charIndex < originalText.length) {
            const char = originalText[charIndex];
            cursor.insertAdjacentText('beforebegin', char);
            charIndex++;

            const typingSpeed = 50 + (Math.random() * 30 - 15);
            const pause = (char === ',' || char === '.') ? 300 : 0;

            setTimeout(typeCharacter, typingSpeed + pause);
        } else {
            setInterval(() => {
                cursor.style.opacity = (cursor.style.opacity === '0') ? '1' : '0';
            }, 500);
        }
    }

    setTimeout(typeCharacter, 300);
}


function createHTML(featuredArticles, recentArticles) {
    const featuredCards = renderList(featuredArticles, FeaturedCard);
    const recentCards = renderList(recentArticles, RecentCard);

    return `
        <div class="page" id="home-page">
            <div class="container">
                <section class="welcome-section">
                    <h1 class="typewriter-heading">News, features, and perspectives from the students of Andover High.</h1>
                </section>
                <hr class="main-divider">
            </div>
            <main class="container content-grid">
                <div class="featured-column">
                    <h2 class="section-title">Featured</h2>
                    <div class="featured-articles-wrapper">${featuredCards}</div>
                </div>
                <div class="recent-column">
                    <h2 class="section-title">Recent</h2>
                    <div class="recent-grid">${recentCards}</div>
                </div>
            </main>
        </div>
    `;
}

export async function render(container) {
    const { articles } = await getCombinedData();
    const featuredArticles = articles.filter(a => a.display === 'featured').slice(0, 2);
    const recentArticles = articles.filter(a => a.display === 'recent').slice(0, 6);

    container.innerHTML = createHTML(featuredArticles, recentArticles);

    populateTicker(articles);
    initTypewriterEffect();
}