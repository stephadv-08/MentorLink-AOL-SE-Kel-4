const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRx = /^\d{10,}$/;

function isValidEmailOrPhone(val) {
    return emailRx.test(val) || phoneRx.test(val.replace(/[\s\-\(\)]/g, ''));
}

async function handleLogin() {
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    const emailErr = document.getElementById('login-email-err');
    const passErr = document.getElementById('login-pass-err');
    let valid = true;

    const emailVal = emailInput.value.trim();
    if (!emailVal) {
        emailInput.classList.add('error');
        emailErr.textContent = 'Email atau nomor HP tidak boleh kosong';
        emailErr.classList.add('show');
        valid = false;
    } else if (!isValidEmailOrPhone(emailVal)) {
        emailInput.classList.add('error');
        emailErr.textContent = 'Masukkan email valid (contoh@email.com) atau nomor HP min. 10 digit';
        emailErr.classList.add('show');
        valid = false;
    } else {
        emailInput.classList.remove('error');
        emailErr.classList.remove('show');
    }

    const passVal = passInput.value;
    if (!passVal) {
        passInput.classList.add('error');
        passErr.textContent = 'Kata sandi tidak boleh kosong';
        passErr.classList.add('show');
        valid = false;
    } else if (passVal.length < 8) {
        passInput.classList.add('error');
        passErr.textContent = 'Kata sandi minimal 8 karakter';
        passErr.classList.add('show');
        valid = false;
    } else {
        passInput.classList.remove('error');
        passErr.classList.remove('show');
    }

    if (!valid) return;

    try {

        const response = await fetch(
            '/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailVal,
                    password: passVal
                })
            }
        );

        const data = await response.json();

        if (!data.success) {
            passErr.textContent = 'Email atau password salah';
            passErr.classList.add('show');
            return;
        }

        localStorage.setItem(
            'pendingUserId',
            data.user.id
        );

        localStorage.setItem(
            'pendingUserRole',
            data.user.role
        );

        localStorage.setItem(
            'pendingUserEmail',
            data.user.email
        );

        window.location.href =
            `verify.html?flow=login&dest=${encodeURIComponent(data.user.email)}`;

    } catch (err) {

        console.error(err);

        alert('Gagal terhubung ke server');
    }
}

document.getElementById('login-email').addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
document.getElementById('login-password').addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });