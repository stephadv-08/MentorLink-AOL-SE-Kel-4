let selectedMethod = null;

const params =
    new URLSearchParams(
        window.location.search
    );

const bookingId =
    new URLSearchParams(
        window.location.search
    ).get('bookingId') ||
    new URLSearchParams(
        window.location.search
    ).get('booking');

function goTo(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function completePayment() {
    console.log('bookingId =', bookingId);
    const response =
        await fetch(
            '/payment',
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    bookingId,
                    amount: 50000,
                    method: 'QRIS'
                })
            }
        );

    const data =
        await response.json();

    if (data.success) {

        alert(
            'Pembayaran berhasil'
        );

        window.location.href =
            'student/bookings.html';
    }
}

function toggleDropdown(menuId, triggerEl) {
    const menu = document.getElementById(menuId);
    const isOpen = menu.classList.contains('show');
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    document.querySelectorAll('.field-select').forEach(el => el.classList.remove('open'));
    if (!isOpen) {
        menu.classList.add('show');
        triggerEl.classList.add('open');
    }
}

document.addEventListener('click', function (e) {
    if (!e.target.closest('.field-select') && !e.target.closest('.dropdown-menu')) {
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
        document.querySelectorAll('.field-select').forEach(el => el.classList.remove('open'));
    }
});

function selectWallet(name, badgeClass) {
    selectedMethod = name;
    document.getElementById('wallet-label').textContent = name;
    const logos = document.getElementById('wallet-logos');
    logos.innerHTML = `<div class="logo-badge ${badgeClass}">${name}</div>`;
    document.getElementById('wallet-dropdown').classList.remove('show');
    document.getElementById('wallet-select').classList.remove('open');
}

function selectBank(name) {
    selectedMethod = name;
    document.getElementById('bank-label').textContent = name;
    document.getElementById('bank-dropdown').classList.remove('show');
    document.getElementById('bank-select').classList.remove('open');
}

// ===== INPUT FORMATTERS =====
function formatCard(input) {
    let v = input.value.replace(/\D/g, '').substring(0, 16);
    input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input) {
    let v = input.value.replace(/\D/g, '').substring(0, 4);
    if (v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
    input.value = v;
}