const params = new URLSearchParams(window.location.search);
const name = params.get('name');
const initials = params.get('initials');
if (name) document.getElementById('thread-name').textContent = name;
if (initials) document.getElementById('thread-initials').textContent = initials;

const UNREAD_KEY = 'mentorlink_unread';
function getUnread() {
    try { return JSON.parse(localStorage.getItem(UNREAD_KEY)) || {}; }
    catch (e) { return {}; }
}
function saveUnread(data) {
    localStorage.setItem(UNREAD_KEY, JSON.stringify(data));
}
function updateSidebarBadge() {
    const unread = getUnread();
    const unreadPeopleCount = Object.values(unread).filter(v => v > 0).length;
    const badge = document.getElementById('sidebar-msg-badge');
    if (badge) {
        if (unreadPeopleCount > 0) {
            badge.textContent = unreadPeopleCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

if (name) {
    const unread = getUnread();
    if (unread[name] && unread[name] > 0) {
        unread[name] = 0;
        saveUnread(unread);
    }
}
updateSidebarBadge();

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