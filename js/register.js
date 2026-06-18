const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRx = /^\d{10,}$/;

// Simulated registered accounts
const REGISTERED_ACCOUNTS = ['test@email.com', '08123456789', '081234567890'];

function isValidEmailOrPhone(val) {
    return emailRx.test(val) || phoneRx.test(val.replace(/[\s\-\(\)]/g, ''));
}

async function handleRegister() {
    const emailInput =
        document.getElementById('reg-email');

    const val =
        emailInput.value.trim();

    if (!isValidEmailOrPhone(val)) {
        return;
    }

    const response = await fetch(
        '/register',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: val,
                phone: null,
                password: 'temporary',
                role: 'student'
            })
        }
    );

    const data = await response.json();

    if (data.success) {
        localStorage.setItem(
            'pendingUser',
            val
        );

        window.location.href =
            `verify.html?flow=register&dest=${encodeURIComponent(val)}`;
    }
}

function handleGoogleRegister() {
    // Placeholder for Google OAuth
    const googleEmail = 'google-user@gmail.com';
    const isRegistered = REGISTERED_ACCOUNTS.includes(googleEmail.toLowerCase().trim());

    if (isRegistered) {
        window.location.href = '../cariMentor.html';
    } else {
        window.location.href = 'dataAkunStudent.html';
    }
}

document.getElementById('reg-email').addEventListener('keydown', e => { if (e.key === 'Enter') handleRegister(); });