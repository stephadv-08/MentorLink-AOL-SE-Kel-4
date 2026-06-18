const params = new URLSearchParams(window.location.search);
const flow = params.get('flow') || 'login';
const dest = params.get('dest') || '';
const isLogin = flow === 'login';

const USERS = [
    {
        email: 'test@email.com',
        name: 'Test User'
    },
    {
        email: 'mentor@email.com',
        name: 'Mentor Demo'
    },
    {
        email: 'student@email.com',
        name: 'Student Demo'
    }
];
const existingUser =
    USERS.find(u => u.email === dest);

const alreadyRegistered = !!existingUser;

const btnAction = document.getElementById('btn-action');
const backLink = document.getElementById('back-link');
const destLabel = document.getElementById('destination-label');

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmail = emailRx.test(dest);

if (dest) {
    destLabel.textContent = dest;
} else {
    destLabel.textContent = 'alamat yang kamu daftarkan';
}

if (dest && !isEmail) {
    document.querySelector('.verify-icon svg').innerHTML = `
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
      `;
}

if (isLogin) {
    btnAction.textContent = 'Masuk';
    backLink.href = 'login.html';
    backLink.textContent = 'halaman masuk';
} else {
    btnAction.textContent = 'Daftar';
    backLink.href = 'register.html';
    backLink.textContent = 'halaman daftar';
}

const inputs = Array.from(document.querySelectorAll('.otp-input'));

inputs.forEach((inp, idx) => {
    inp.addEventListener('input', e => {
        const val = inp.value.replace(/\D/g, '');
        inp.value = val ? val[val.length - 1] : '';
        inp.classList.toggle('filled', !!inp.value);
        clearErrors();
        if (inp.value && idx < inputs.length - 1) inputs[idx + 1].focus();
    });

    inp.addEventListener('keydown', e => {
        if (e.key === 'Backspace' && !inp.value && idx > 0) {
            inputs[idx - 1].value = '';
            inputs[idx - 1].classList.remove('filled');
            inputs[idx - 1].focus();
        }
        if (e.key === 'Enter') handleVerify();
    });

    inp.addEventListener('paste', e => {
        e.preventDefault();
        const pasted = (e.clipboardData || window.clipboardData)
            .getData('text').replace(/\D/g, '').slice(0, 6);
        pasted.split('').forEach((ch, i) => {
            if (inputs[i]) {
                inputs[i].value = ch;
                inputs[i].classList.add('filled');
            }
        });
        const nextEmpty = inputs.findIndex(inp => !inp.value);
        (inputs[nextEmpty] || inputs[inputs.length - 1]).focus();
        clearErrors();
    });
});

function getOtpValue() {
    return inputs.map(i => i.value).join('');
}
function clearErrors() {
    inputs.forEach(i => i.classList.remove('error'));
    document.getElementById('otp-err').classList.remove('show');
}
function setError(msg) {
    inputs.forEach(i => i.classList.add('error'));
    const err = document.getElementById('otp-err');
    err.textContent = msg;
    err.classList.add('show');
}

function handleVerify() {
    const code = getOtpValue();
    if (code.length < 6) {
        setError('Masukkan kode verifikasi 6 digit.');
        return;
    }

    if (code.startsWith('0')) {
        setError('Kode verifikasi salah atau sudah kedaluwarsa.');
        return;
    }

    btnAction.classList.add('loading');
    btnAction.textContent = 'Memverifikasi...';

    setTimeout(() => {
        if (isLogin) {
            window.location.href = '../cariMentor.html';
        } else if (alreadyRegistered) {
            window.location.href = '../cariMentor.html';
        } else {
            window.location.href = 'dataAkunStudent.html';
        }
    }, 800);
}

let countdown = 60;
const resendLink = document.getElementById('resend-link');
const resendTimer = document.getElementById('resend-timer');

const timer = setInterval(() => {
    countdown--;
    resendTimer.textContent = countdown > 0 ? `(${countdown})` : '';
    if (countdown <= 0) {
        clearInterval(timer);
        resendLink.classList.remove('disabled');
        resendTimer.textContent = '';
    }
}, 1000);

resendLink.addEventListener('click', () => {
    if (resendLink.classList.contains('disabled')) return;
    resendLink.classList.add('disabled');
    countdown = 60;
    resendTimer.textContent = `(${countdown})`;
    const t2 = setInterval(() => {
        countdown--;
        resendTimer.textContent = countdown > 0 ? `(${countdown})` : '';
        if (countdown <= 0) {
            clearInterval(t2);
            resendLink.classList.remove('disabled');
            resendTimer.textContent = '';
        }
    }, 1000);
    resendLink.textContent = 'Terkirim!';
    setTimeout(() => resendLink.textContent = 'Kirim ulang', 2000);
});

inputs[0].focus();