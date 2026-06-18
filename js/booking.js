let selectedDate = null;
let selectedTime = null;

function selectDate(el) {

    document.querySelectorAll('.date-chip')
        .forEach(c => c.classList.remove('active'));

    el.classList.add('active');

    selectedDate = el.textContent.trim();

    console.log(
        'selectedDate =',
        selectedDate
    );
}

function selectTime(el) {

    if (el.classList.contains('unavailable'))
        return;

    document.querySelectorAll('.time-chip')
        .forEach(c => c.classList.remove('active'));

    el.classList.add('active');

    selectedTime = el.textContent.trim();

    console.log(
        'selectedTime =',
        selectedTime
    );
}

const matkulLink =
    document.getElementById('nav-matkul');

if (matkulLink) {

    const accountType =
        localStorage.getItem('accountType')
        || 'student';

    if (accountType === 'mentor') {
        matkulLink.href = 'akunMentor.html';
    } else {
        matkulLink.href = 'mentor/dataAkunMentor.html';
    }

}

async function loadBookingMentor() {

    const params =
        new URLSearchParams(window.location.search);

    const mentorId =
        params.get('id') ||
        params.get('mentor');

    if (!mentorId) {
        alert('Mentor tidak ditemukan');
        return;
    }

    const response =
        await fetch(
            `/mentor/${mentorId}`
        );

    console.log('mentorId =', mentorId);
    console.log('status =', response.status);

    const text = await response.text();

    console.log('response =', text);

    const mentor = JSON.parse(text);

    document.getElementById(
        'booking-mentor-name'
    ).textContent =
        mentor.full_name;

    document.getElementById(
        'booking-mentor-role'
    ).textContent =
        mentor.profession;

    document.getElementById(
        'booking-mentor-rating'
    ).textContent =
        `⭐ ${mentor.rating}`;

    document.getElementById(
        'booking-mentor-price'
    ).textContent =
        `Rp ${Number(
            mentor.hourly_rate
        ).toLocaleString('id-ID')}`;

    document.getElementById(
        'booking-mentor-photo'
    ).src =
        mentor.photo;
}

async function proceedToPayment() {
    if (!selectedDate) {

        alert(
            'Pilih tanggal terlebih dahulu'
        );

        return;
    }

    if (!selectedTime) {

        alert(
            'Pilih jam terlebih dahulu'
        );

        return;
    }
    const studentId =
        localStorage.getItem('userId') ||
        localStorage.getItem('pendingUserId');

    const mentorId =
        new URLSearchParams(
            window.location.search
        ).get('mentor') ||
        new URLSearchParams(
            window.location.search
        ).get('id');

    console.log('mentorId =', mentorId);
    console.log('studentId =', studentId);

    const response =
        await fetch(
            '/create-booking',
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/json'
                },
                body: JSON.stringify({
                    studentId,
                    mentorId,
                    bookingDate:
                        selectedDate,
                    bookingTime:
                        selectedTime,
                    notes:
                        document
                            .getElementById('session-notes')
                            ?.value || ''
                })
            }
        );

    const data =
        await response.json();
    console.log('create-booking response =', data);
    if (data.success) {

        window.location.href =
            `payment.html?bookingId=${data.bookingId}`;
    }
}

loadBookingMentor();