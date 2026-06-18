async function loadUser() {

  const res = await fetch(
    '/me',
    {
      credentials: 'include'
    }
  );

  const data = await res.json();

  const navAction =
    document.getElementById('navAction');

  if (data.loggedIn) {

    navAction.innerHTML = `
      <a
        href="student/editProfile.html"
        class="btn-nav"
      >
        Akun
      </a>
    `;

    const heroRegBtn = document.getElementById('hero-register-btn');
    if (heroRegBtn) {
      heroRegBtn.textContent = 'Lihat dashboardmu';
      heroRegBtn.href = 'student/editProfile.html';
    }

  } else {

    navAction.innerHTML = `
      <a
        href="account/login.html"
        class="btn-nav"
      >
        Daftar/Masuk
      </a>
    `;
  }
}

document
  .getElementById('btnCariMentor')
  .addEventListener('click', async (e) => {

    e.preventDefault();

    const res = await fetch(
      '/me',
      {
        credentials: 'include'
      }
    );

    const data = await res.json();

    if (data.loggedIn) {
      window.location.href = 'cariMentor.html';
    } else {
      window.location.href = 'account/register.html';
    }

  });

loadUser();