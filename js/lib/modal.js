import { getCombinedData } from '../api.js';

export function initModal() {
    const modalOverlay = document.getElementById('staff-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBodyContent = document.getElementById('modal-body-content');

    const createStaffModalHTML = (person) => `
        <img src="${person.image}" alt="${person.name}" class="modal-img">
        <div class="modal-bio">
            <h2>${person.name}</h2>
            <h4>${person.role}</h4>
            <p>${person.bio}</p>
        </div>
    `;

    const openModal = (person) => {
        modalBodyContent.innerHTML = createStaffModalHTML(person);
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    document.getElementById('main-content').addEventListener('click', async (e) => {
        const card = e.target.closest('.staff-card');
        if (card) {
            const staffName = card.dataset.name;
            const { staff } = await getCombinedData();
            const person = staff.find(p => p.name === staffName);
            if (person) openModal(person);
        }
    });

    modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    return closeModal;
}