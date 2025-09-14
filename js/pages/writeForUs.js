import { PageHeader } from '../components/layout/PageHeader.js';
import { Container } from '../components/layout/Container.js';
import { Section } from '../components/layout/Section.js';

let resizeTimer;

function createHTML() {
const opportunitiesSection = `
<div class="opportunities-section">
<h2>Ways to Contribute</h2>
<div class="emoji-decoration">📝</div>
<div class="emoji-decoration">📸</div>
<div class="emoji-decoration">💡</div>
<div class="emoji-decoration">🎤</div>
<div class="emoji-decoration">🎨</div>
<div class="emoji-decoration">🏆</div>
<div class="emoji-decoration">📰</div>
<div class="emoji-decoration">💭</div>
<div class="emoji-decoration">🎬</div>
<div class="emoji-decoration">📈</div>
<div class="emoji-decoration">🌍</div>
<div class="emoji-decoration">🎉</div>
</div>
`;

const contactCallout = `
<div class="write-contact-callout">
<div class="callout-content">
<h3>Ready to Get Started?</h3>
<p>Reach out to us and let's discuss your ideas!</p>
<div class="callout-actions">
<a href="mailto:andoverview@andoverma.us" class="contact-btn primary">Email Us</a>
<a href="#contact" class="contact-btn secondary">Contact Page</a>
</div>
</div>
</div>
`;

const pageContent = `
${PageHeader('Write for Us', 'Join our staff or contribute as a guest writer.')}

<div class="write-content-wrapper">
${opportunitiesSection}

<div class="about-description">
<h2>Join Our Staff</h2>
<p>Newspaper Productions is a course at Andover High School rather than a club, so the only way to join the staff is to sign up for the course during course selection or switch into it in the first few weeks of the school year. Newspaper Productions is a year-long half credit course that meets every Monday night from 5 p.m. to 7 p.m. Students have to attend almost every meeting to participate in the course.</p>

<h2>Guest Contributions</h2>
<p>If you want to write for us without joining the staff, we welcome guest articles, photos, and opinion columns. Please email us at <a href="mailto:andoverview@andoverma.us">andoverview@andoverma.us</a> for more information.</p>
<p>If you would like to contact us for other purposes such as placing an ad or to ask us to cover a specific issue, please email us or contact us through our <a href="#contact">contact page</a>. You can also contact us to have your club be Club of the Month.</p>

<h2>Editorial Guidelines</h2>
<p>The staff of ANDOVERVIEW reviews letters to the editor and guest commentaries and reserves the right to refuse material for reasons pertaining to length, clarity, libel, obscenity, copyright infringement, or material disruption to the educational process of Andover High School.</p>
</div>

${contactCallout}
</div>
`;

return Section({
className: 'page write-for-us-page',
content: Container(pageContent)
});
}

function arrangeEmojis() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const container = document.querySelector('.opportunities-section');
    if (!container) return;
    const emojis = container.querySelectorAll('.emoji-decoration');
    const numEmojis = emojis.length;
    const centerX = container.offsetWidth / 2;
    const centerY = container.offsetHeight / 2; 
    const radiusX = centerX * 0.85; 
    const radiusY = centerY * 0.75; 
    const angleStep = (2 * Math.PI) / numEmojis;

    emojis.forEach((emoji, i) => {
        const angle = i * angleStep;
        const x = centerX + radiusX * Math.cos(angle);
        const y = centerY + radiusY * Math.sin(angle);
        emoji.style.left = `${x - emoji.offsetWidth / 2}px`;
        emoji.style.top = `${y - emoji.offsetHeight / 2}px`;
        emoji.style.animationDelay = `${i * 0.2}s`;
    });
}

function makeDraggable() {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const emojis = document.querySelectorAll('.emoji-decoration');
    const header = document.querySelector('.main-header');
    let highestZIndex = 11;

    emojis.forEach(emoji => {
        let isDragging = false;
        let hasDragged = false;
        let startMouseX, startMouseY;
        let startEmojiX, startEmojiY;
        let clickCount = 0;
        let clickTimeout;

        emoji.hideBubbleTimeout = null;

        emoji.addEventListener('mousedown', startDrag);
        emoji.addEventListener('touchstart', startDrag, { passive: false });
        emoji.addEventListener('click', handleEmojiClick);

        function startDrag(e) {
            if (e.type === 'mousedown' && e.button !== 0) {
                return;
            }

            e.preventDefault();
            isDragging = true;
            hasDragged = false;
            emoji.classList.add('dragging');
            highestZIndex++;
            emoji.style.zIndex = highestZIndex;
            const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
            startMouseX = clientX;
            startMouseY = clientY;
            startEmojiX = emoji.offsetLeft;
            startEmojiY = emoji.offsetTop;
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('touchend', stopDrag);
        }

        function drag(e) {
            if (!isDragging) return;
            if (emoji.speechBubble) {
                emoji.speechBubble.remove();
                emoji.speechBubble = null;
                clearTimeout(emoji.hideBubbleTimeout);
            }
            e.preventDefault();
            hasDragged = true;
            const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
            const deltaX = clientX - startMouseX;
            const deltaY = clientY - startMouseY;
            let newX = startEmojiX + deltaX;
            let newY = startEmojiY + deltaY;
            const topBoundary = header.offsetHeight;
            const containerRect = emoji.offsetParent.getBoundingClientRect();
            const emojiViewportTop = containerRect.top + newY;
            if (emojiViewportTop < topBoundary) {
                newY = topBoundary - containerRect.top;
            }
            emoji.style.left = `${newX}px`;
            emoji.style.top = `${newY}px`;
            emoji.style.right = 'auto';
            emoji.style.bottom = 'auto';
        }

        function stopDrag() {
            if (!isDragging) return;
            isDragging = false;
            emoji.classList.remove('dragging');
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', stopDrag);
            if (hasDragged) {
                setTimeout(() => { hasDragged = false; }, 100);
            }
        }

        function handleEmojiClick(e) {
            if (isDragging || hasDragged) return;
            clickCount++;
            clearTimeout(clickTimeout);
            if (clickCount >= 5) {
                showSpeechBubble(emoji, clickCount);
            } else {
                clickTimeout = setTimeout(() => { clickCount = 0; }, 3000);
            }
        }

        function showSpeechBubble(emojiElement, totalClicks) {
            let message, anger = 'mild';
            if (totalClicks <= 7) {
                message = 'Why do you keep doing that?';
                anger = 'mild';
            } else if (totalClicks <= 12) {
                message = 'Seriously, stop clicking me!';
                anger = 'moderate';
            } else if (totalClicks <= 18) {
                message = 'I SAID STOP CLICKING!!!';
                anger = 'angry';
            } else if (totalClicks <= 25) {
                message = 'LEAVE ME ALONE!!!!!!';
                anger = 'furious';
            } else {
                message = '...';
                anger = 'given-up';
            }

            let scrollHandler;

            const removeBubble = (bubble) => {
                window.removeEventListener('scroll', scrollHandler);

                if (bubble && bubble.parentNode) {
                    bubble.classList.remove('show');
                    setTimeout(() => {
                        if (bubble.parentNode) bubble.remove();
                        if (emojiElement.speechBubble === bubble) {
                            emojiElement.speechBubble = null;
                        }
                    }, 300);
                }
            };

            if (emojiElement.speechBubble && emojiElement.speechBubble.dataset.anger === anger) {
                clearTimeout(emojiElement.hideBubbleTimeout);
                const duration = anger === 'given-up' ? 1000 : anger === 'furious' ? 4000 : 3000;
                emojiElement.hideBubbleTimeout = setTimeout(() => removeBubble(emojiElement.speechBubble), duration);
                return;
            }

            if (emojiElement.speechBubble) {
                clearTimeout(emojiElement.hideBubbleTimeout);
                removeBubble(emojiElement.speechBubble);
            }

            const bubble = document.createElement('div');
            bubble.className = 'emoji-speech-bubble';
            bubble.textContent = message;
            bubble.dataset.anger = anger;
            bubble.style.left = `${emojiElement.offsetLeft + emojiElement.offsetWidth / 2}px`;
            bubble.style.top = `${emojiElement.offsetTop - 60}px`;
            emojiElement.offsetParent.appendChild(bubble);
            emojiElement.speechBubble = bubble;

            setTimeout(() => bubble.classList.add('show'), 10);

            scrollHandler = () => removeBubble(bubble);
            window.addEventListener('scroll', scrollHandler, { once: true });

            const duration = anger === 'given-up' ? 1000 : anger === 'furious' ? 4000 : 3000;
            emojiElement.hideBubbleTimeout = setTimeout(() => removeBubble(bubble), duration);
        }
    });
}

export function render(container) {
    container.innerHTML = createHTML();

    setTimeout(() => {
        arrangeEmojis();
        makeDraggable();
    }, 100);

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(arrangeEmojis, 250);
        });
    }
}