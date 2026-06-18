const MENTOR_TAGS = [
    "Kuliah S2",
    "Keamanan Siber",
    "Jaringan Komputer",
    "Online",
];

const MENTOR_REVIEWS = [
    { name: "Rina Setiawati", stars: 5, comment: "Penjelasannya sangat mudah dipahami, sangat membantu persiapan ujian saya!" },
    { name: "Budi Santoso", stars: 4, comment: "Mentor yang sabar dan responsif. Materi jaringan komputer jadi lebih jelas." },
    { name: "Dewi Lestari", stars: 5, comment: "Sangat profesional dan berpengalaman. Highly recommended!" },
    { name: "Fajar Nugraha", stars: 3, comment: "Cukup membantu, tapi kadang jadwal agak susah disesuaikan." },
];

const ACCOUNT_TYPE = "student";

const tagsContainer = document.getElementById('mentor-tags');
MENTOR_TAGS.forEach(tag => {
    const s = document.createElement('span');
    s.className = 'mentor-tag';
    s.textContent = tag;
    tagsContainer.appendChild(s);
});

function getInitials(name) {
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}
function renderStars(n) {
    let h = '';
    for (let i = 1; i <= 5; i++)
        h += `<span class="star ${i <= n ? 'filled' : 'empty'}">${i <= n ? '★' : '☆'}</span>`;
    return h;
}
function renderReviews(list) {
    const panel = document.getElementById('reviews-panel');
    panel.innerHTML = '';
    if (!list.length) {
        panel.innerHTML = '<p style="color:rgba(255,255,255,.7);font-size:.82rem;text-align:center;padding:16px 0;">Belum ada ulasan.</p>';
        return;
    }
    list.forEach(r => {
        const d = document.createElement('div');
        d.className = 'review-item';
        d.innerHTML = `
          <div class="review-header">
            <div class="review-avatar">${getInitials(r.name)}</div>
            <span class="review-name">${r.name}</span>
            <div class="review-stars">${renderStars(r.stars)}</div>
          </div>
          <p class="review-comment">${r.comment}</p>`;
        panel.appendChild(d);
    });
}
renderReviews(MENTOR_REVIEWS);

function switchTab(tab) {
    const rp = document.getElementById('reviews-panel');
    const fp = document.getElementById('filter-panel');
    const tr = document.getElementById('tab-reviews');
    const tf = document.getElementById('tab-filter');
    if (tab === 'reviews') {
        rp.style.display = '';
        fp.classList.remove('visible');
        tr.classList.add('active'); tf.classList.remove('active');
    } else {
        rp.style.display = 'none';
        fp.classList.add('visible');
        tf.classList.add('active'); tr.classList.remove('active');
    }
}

function filterReviews(stars, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filtered = stars === 0 ? MENTOR_REVIEWS : MENTOR_REVIEWS.filter(r => r.stars === stars);
    renderReviews(filtered);
    switchTab('reviews');
}

function toggleSimpan() {
    const btn = document.getElementById('btn-simpan');
    btn.classList.toggle('tersimpan');
    btn.textContent = btn.classList.contains('tersimpan') ? 'Tersimpan' : 'Simpan';
}

async function loadMentorProfile() {

    const params =
        new URLSearchParams(window.location.search);

    const mentorId =
        params.get('id');

    if (!mentorId) {
        alert('Mentor tidak ditemukan');
        return;
    }

    const response =
        await fetch(
            `/mentor/${mentorId}`
        );

    const mentor =
        await response.json();

    document.getElementById('mentor-name')
        .textContent = mentor.full_name;

    document.getElementById('mentor-degree')
        .textContent = mentor.education || '';

    document.getElementById('mentor-about')
        .textContent = mentor.bio || '';

    document.getElementById('mentor-sertifikat')
        .textContent = mentor.degree || '';
    console.log(mentor.photo);
    document.getElementById('mentor-photo')
        .src =
        mentor.photo || 'assets/default-avatar.png';
    document
        .getElementById('btn-booking')
        .onclick = () => {

            window.location.href =
                `booking.html?id=${mentorId}`;
        };
}

loadMentorProfile();