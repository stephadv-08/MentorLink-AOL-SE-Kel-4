const accountType = localStorage.getItem('accountType') || 'student';
document.getElementById('btn-akun').href =
    accountType === 'mentor' ? 'mentor/editProfile.html' : 'student/editProfile.html';

let activeBidang = 'semua';

document.getElementById('bidangTabs').addEventListener('click', function (e) {
    const tab = e.target.closest('.bidang-tab');
    if (!tab) return;
    document.querySelectorAll('.bidang-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeBidang = tab.dataset.bidang;
    currentPage = 1;
    renderMentors();
});

function filterCheckboxes(listId, query) {
    const items = document.querySelectorAll(`#${listId} .filter-option`);
    const q = query.toLowerCase();
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? '' : 'none';
    });
}

function getChecked(listId) {
    return Array.from(document.querySelectorAll(`#${listId} input:checked`))
        .map(cb => cb.value);
}

function applyFilters() {
    currentPage = 1;
    renderMentors();
}

document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => { currentPage = 1; renderMentors(); });
});

function sortMentors() {
    currentPage = 1;
    renderMentors();
}

const ITEMS_PER_PAGE = 5;
let currentPage = 1;
let totalPages = 1;

function changePage(delta) {
    goToPage(currentPage + delta);
}

function goToPage(p) {
    if (p < 1 || p > totalPages) return;
    currentPage = p;
    renderMentors();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

let mentorsLoaded = false;

function renderMentors() {
    const allCards = Array.from(document.querySelectorAll('#mentorList .mentor-card'));

    const checkedSkills = getChecked('skillList');
    const checkedProfesi = getChecked('profesiList');
    const checkedPendidikan = getChecked('pendidikanList');
    const checkedKetersediaan = getChecked('ketersediaanList');
    const priceMinEl = document.getElementById('priceMin');
    const priceMaxEl = document.getElementById('priceMax');
    const sortSelectEl = document.getElementById('sortSelect');

    const priceMin =
        parseFloat(priceMinEl?.value) || 0;

    const priceMax =
        parseFloat(priceMaxEl?.value) || Infinity;

    const sortVal =
        sortSelectEl?.value || '';

    let visible = allCards.filter(card => {
        const bidang = card.dataset.bidang || '';
        const skills = (card.dataset.skills || '').split(',');
        const profesi = card.dataset.profesi || '';
        const pendidikan = card.dataset.pendidikan || '';
        const ketersediaan = card.dataset.ketersediaan || '';
        const price = parseFloat(card.dataset.price) || 0;

        if (activeBidang !== 'semua' && bidang !== activeBidang) return false;
        if (checkedSkills.length && !checkedSkills.some(s => skills.includes(s))) return false;
        if (checkedProfesi.length && !checkedProfesi.includes(profesi)) return false;
        if (checkedPendidikan.length && !checkedPendidikan.includes(pendidikan)) return false;
        if (checkedKetersediaan.length && !checkedKetersediaan.includes(ketersediaan)) return false;
        if (price < priceMin || price > priceMax) return false;
        return true;
    });

    visible.sort((a, b) => {
        if (sortVal === 'rating') return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        if (sortVal === 'price-asc') return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        if (sortVal === 'price-desc') return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
        if (sortVal === 'reviews') return parseInt(b.dataset.reviews) - parseInt(a.dataset.reviews);
        return 0;
    });

    totalPages = Math.max(1, Math.ceil(visible.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = visible.slice(start, start + ITEMS_PER_PAGE);

    allCards.forEach(c => c.style.display = 'none');
    pageItems.forEach(c => c.style.display = 'grid');

    document.getElementById('resultCount').textContent = visible.length;

    const pbContainer = document.getElementById('pageButtons');
    pbContainer.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
        btn.textContent = i;
        btn.onclick = () => goToPage(i);
        pbContainer.appendChild(btn);
    }
    document.getElementById('btnFirst').disabled = currentPage === 1;
    document.getElementById('btnPrev').disabled = currentPage === 1;
    document.getElementById('btnNext').disabled = currentPage === totalPages;
    document.getElementById('btnLast').disabled = currentPage === totalPages;
}

async function loadMentors() {
    const response = await fetch(
        '/mentors'
    );

    const mentors = await response.json();

    const mentorList =
        document.getElementById('mentorList');

    mentorList.innerHTML = '';

    mentors.forEach(mentor => {
        mentorList.insertAdjacentHTML(
            'beforeend',
            `
            <div class="mentor-card"
                data-name="${mentor.full_name}"
                data-rating="${mentor.rating}"
                data-reviews="${mentor.review_count}"
                data-price="${mentor.hourly_rate}"
                data-profesi="${mentor.profession}"
                data-pendidikan="${mentor.education}"
                data-ketersediaan="${mentor.availability}"
                data-bidang="${mentor.bidang}"
                data-skills="">
                
                <div class="mentor-photo">
                    <img src="${mentor.photo}" alt="${mentor.full_name}">
                </div>

                <div class="mentor-info">
                    <div class="mentor-name">
                        ${mentor.full_name}
                    </div>

                    <div class="mentor-rating">
                        <span class="star">★</span>
                        <span>${mentor.rating}</span>
                        <span class="reviews">
                            (${mentor.review_count} ulasan)
                        </span>
                    </div>

                    <p class="mentor-desc">
                        ${mentor.bio}
                    </p>

                    <div class="mentor-card-footer">
                        <div class="mentor-price">
                            Mulai dari
                            <strong>
                                Rp. ${Number(
                mentor.hourly_rate
            ).toLocaleString('id-ID')}
                                / jam
                            </strong>
                        </div>

                        <div class="card-actions">
                            <button
                                class="btn-outline"
                                onclick="window.location.href='profilMentor.html?id=${mentor.id}'">
                                Lihat Profil
                            </button>

                            <button
                                class="btn-book"
                                onclick="window.location.href='booking.html?mentor=${mentor.id}'">
                                Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `
        );
    });

    renderMentors();
}

loadMentors();