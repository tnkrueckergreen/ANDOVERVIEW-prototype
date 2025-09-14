import { getCombinedData } from '../api.js';

function createHTML(staff) {
    const staffCards = staff.map(person => {
        const imageSrc = person.image;
        const altText = `Image for ${person.name}`;

        return `
            <div class="staff-card" data-name="${person.name}">
                <div class="staff-card-img">
                    <img src="${imageSrc}" alt="${altText}" loading="lazy">
                </div>
                <h4>${person.name}</h4>
                <p>${person.role}</p>
            </div>
        `;
    }).join('');

    return `
        <section class="page" id="about-page">
            <div class="container">
                <div class="page-header">
                    <h1>About ANDOVERVIEW</h1>
                </div>

                <div class="collapsible-card" id="about-description-card">
                    <div class="card-header" role="button" aria-expanded="false" aria-controls="about-card-content">
                        <h3>Our Mission & Principles</h3>
                        <button class="card-toggle-btn" aria-label="Toggle description">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="card-content-wrapper" id="about-card-content">
                        <div class="card-content">
                            <p>ANDOVERVIEW is a publication written, edited and designed by the Newspaper Production class to serve as an open forum for students to discuss issues relevant to the Andover High School community.</p>
                            <p>Letters to the editor and guest commentaries are encouraged; please email submissions to the following address: <a href="mailto:andoverview@andoverma.us">andoverview@andoverma.us</a>.</p>
                            <p>If you would like to write for us or join the newspaper staff, please visit the <a href="#contact">Contact page</a> for more information.</p>
                            <p>Include contact information for verification purposes. The staff of ANDOVERVIEW reviews letters to the editor and guest commentaries and reserves the right to refuse material for reasons pertaining to length, clarity, libel, obscenity, copyright infringement, or material disruption to the educational process of Andover High School.</p>
                        </div>
                    </div>
                </div>

                <div class="page-header team-header">
                    <h2>Meet the Team</h2>
                    <p>Click a card to learn more about each staff member!</p>
                </div>
                <div class="staff-grid">${staffCards}</div>
            </div>
        </section>
    `;
}

function attachEventListeners() {
    const card = document.getElementById('about-description-card');
    const header = card.querySelector('.card-header');

    if (header) {
        header.addEventListener('click', () => {
            const isExpanded = card.classList.toggle('is-expanded');
            header.setAttribute('aria-expanded', isExpanded);
        });
    }
}

export async function render(container) {
    const { staff } = await getCombinedData();
    container.innerHTML = createHTML(staff);
    attachEventListeners();
}