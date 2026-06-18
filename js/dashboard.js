document.addEventListener('DOMContentLoaded', () => {
    const filterTabs = document.querySelectorAll('.filter-tab');
    if (filterTabs.length) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const filter = tab.dataset.filter;
                document.querySelectorAll('.booking-item').forEach(item => {
                    if (filter === 'semua' || item.dataset.status === filter) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    const bookingSearch = document.querySelector('.bookings-toolbar .search-box input');
    if (bookingSearch) {
        bookingSearch.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            document.querySelectorAll('.booking-item').forEach(item => {
                const name = item.querySelector('.booking-name').textContent.toLowerCase();
                item.style.display = name.includes(q) ? 'flex' : 'none';
            });
        });
    }

    const viewTabs = document.querySelectorAll('.view-tab');
    viewTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            viewTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    document.querySelectorAll('.star-group').forEach(group => {
        const stars = group.querySelectorAll('svg');
        stars.forEach((star, idx) => {
            star.addEventListener('click', () => {
                stars.forEach((s, i) => {
                    s.classList.toggle('filled', i <= idx);
                });
                group.dataset.value = idx + 1;
            });
        });
    });

    document.querySelectorAll('.field-row').forEach(row => {
        const action = row.querySelector('.field-action');
        const input = row.querySelector('input, select');
        if (!action || !input) return;
        const isSelect = input.tagName === 'SELECT';

        if (isSelect) {
            input.disabled = true;
        } else {
            input.setAttribute('readonly', 'true');
        }

        action.addEventListener('click', (e) => {
            e.preventDefault();
            const isEditing = input.hasAttribute('data-editing');
            if (isEditing) {
                input.removeAttribute('data-editing');
                if (isSelect) {
                    input.disabled = true;
                } else {
                    input.setAttribute('readonly', 'true');
                }
                if (input.value.trim() !== '') {
                    action.textContent = 'Ubah';
                } else {
                    action.textContent = 'Tambahkan';
                }
            } else {
                input.setAttribute('data-editing', 'true');
                if (isSelect) {
                    input.disabled = false;
                    input.focus();
                } else {
                    input.removeAttribute('readonly');
                    input.focus();
                }
                action.textContent = 'Simpan';
            }
        });
    });

    const photoInput = document.getElementById('photo-upload-input');
    const photoAction = document.querySelector('.profile-photo .field-action');
    const photoAvatar = document.querySelector('.profile-photo .avatar');
    if (photoInput && photoAction) {
        photoAction.addEventListener('click', (e) => {
            e.preventDefault();
            photoInput.click();
        });
        photoInput.addEventListener('change', () => {
            const file = photoInput.files[0];
            if (file && photoAvatar) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    photoAvatar.innerHTML = `<img src="${ev.target.result}" alt="Foto profil">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const reviewForm = document.querySelector('.review-submit');
    if (reviewForm) {
        reviewForm.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Terima kasih atas review Anda!');
        });
    }

    const chatSend = document.querySelector('.chat-send');
    const chatInput = document.querySelector('.chat-input-bar input');
    const chatMessages = document.querySelector('.chat-messages');
    if (chatSend && chatInput && chatMessages) {
        const sendMessage = () => {
            const text = chatInput.value.trim();
            if (!text) return;
            const bubble = document.createElement('div');
            bubble.className = 'bubble out';
            bubble.textContent = text;
            chatMessages.appendChild(bubble);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }


    const sitesLink = Array.from(document.querySelectorAll('.sidebar-link')).find(link =>
        link.textContent.trim().toLowerCase().includes('sites')
    ) || document.querySelector('.sidebar-more a');

    if (sitesLink) {
        sitesLink.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Sign out
        `;
        sitesLink.href = '#';
        sitesLink.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const res = await fetch('/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                const data = await res.json();
                if (data.success) {
                    localStorage.clear();
                    window.location.href = '../index.html';
                } else {
                    alert('Gagal sign out');
                }
            } catch (err) {
                console.error(err);
                alert('Gagal terhubung ke server');
            }
        });
    }

});

(function () {
    const UNREAD_KEY = 'mentorlink_unread';
    function getUnread() {
        try { return JSON.parse(localStorage.getItem(UNREAD_KEY)) || {}; } catch (e) { return {}; }
    }
    function updateSidebarBadge() {
        const unread = getUnread();
        const count = Object.values(unread).filter(v => v > 0).length;
        const badge = document.getElementById('sidebar-msg-badge');
        if (!badge) return;
        if (count > 0) { badge.textContent = count; badge.style.display = 'flex'; }
        else { badge.style.display = 'none'; }
    }
    updateSidebarBadge();
    window.addEventListener('storage', updateSidebarBadge);
    window.addEventListener('focus', updateSidebarBadge);
})();

(function () {
    const BOOKINGS_KEY = 'mentorlink_bookings_count';
    if (localStorage.getItem(BOOKINGS_KEY) === null) localStorage.setItem(BOOKINGS_KEY, 3);
    function updateBookingsBadge() {
        try {
            const count = parseInt(localStorage.getItem(BOOKINGS_KEY));
            const badge = document.getElementById('sidebar-bookings-badge');
            if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'flex' : 'none'; }
        } catch (e) { }
    }
    updateBookingsBadge();
    window.addEventListener('storage', updateBookingsBadge);
    window.addEventListener('focus', updateBookingsBadge);
})();