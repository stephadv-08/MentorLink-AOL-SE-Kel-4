const params = new URLSearchParams(window.location.search);
const name = params.get('name');
const initials = params.get('initials');
if (name) document.getElementById('review-name').textContent = name;
if (initials) document.getElementById('review-initials').textContent = initials;

const UNREAD_KEY = 'mentorlink_unread';
const BOOKINGS_KEY = 'mentorlink_bookings_count';

function updateSidebarMsgBadge() {
    try {
        const unread = JSON.parse(localStorage.getItem(UNREAD_KEY)) || {};
        const count = Object.values(unread).filter(v => v > 0).length;
        const badge = document.getElementById('sidebar-msg-badge');
        if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'flex' : 'none'; }
    } catch (e) { }
}

function updateSidebarBookingsBadge() {
    try {
        const count = parseInt(localStorage.getItem(BOOKINGS_KEY));
        const badge = document.getElementById('sidebar-bookings-badge');
        if (badge) { badge.textContent = count; badge.style.display = count > 0 ? 'flex' : 'none'; }
    } catch (e) { }
}

if (localStorage.getItem(BOOKINGS_KEY) === null) {
    localStorage.setItem(BOOKINGS_KEY, 3);
}

updateSidebarMsgBadge();
updateSidebarBookingsBadge();
window.addEventListener('storage', () => { updateSidebarMsgBadge(); updateSidebarBookingsBadge(); });
window.addEventListener('focus', () => { updateSidebarMsgBadge(); updateSidebarBookingsBadge(); });