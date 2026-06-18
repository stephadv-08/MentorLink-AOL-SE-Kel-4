const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const session = require('express-session');

const app = express();
// console.log('PAYMENT VERSION LOADED');

app.use(cors());
app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, '..')
  )
);


app.use(session({
  secret: 'mentorlink-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.get('/users', async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM users'
  );

  res.json(rows);
});

app.get('/mentors', async (req, res) => {
  const [rows] = await db.query(`
    SELECT
      id,
      full_name,
      profession,
      bio,
      hourly_rate,
      education,
      availability,
      bidang,
      rating,
      review_count,
      photo
    FROM mentor_profiles
  `);

  res.json(rows);
});

app.get('/mentor/:id', async (req, res) => {

  const mentorId = req.params.id;

  const [mentorRows] = await db.query(
    'SELECT * FROM mentor_profiles WHERE id = ?',
    [mentorId]
  );

  res.json(mentorRows[0]);
});

app.post('/register', async (req, res) => {
  try {
    const {
      email,
      phone,
      password,
      role
    } = req.body;

    await db.query(
      `
      INSERT INTO users
      (
        email,
        phone,
        password_hash,
        role
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        email,
        phone,
        password,
        role
      ]
    );

    res.json({
      success: true
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.get('/test-register', async (req, res) => {
  try {
    const [result] = await db.query(`
      INSERT INTO users
      (
        email,
        password_hash,
        role
      )
      VALUES
      (
        'test@gmail.com',
        '123456',
        'student'
      )
    `);

    console.log(result);

    res.json({
      success: true,
      insertId: result.insertId
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const [users] = await db.query(
    `
    SELECT *
    FROM users
    WHERE email = ?
    AND password_hash = ?
    `,
    [email, password]
  );

  if (users.length === 0) {
    return res.status(401).json({
      success: false
    });
  }

  req.session.user = {
    id: users[0].id,
    email: users[0].email,
    role: users[0].role
  };

  res.json({
    success: true,
    user: {
      id: users[0].id,
      email: users[0].email,
      role: users[0].role
    }
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Cannot log out' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

app.get('/me', (req, res) => {

  if (!req.session.user) {
    return res.json({
      loggedIn: false
    });
  }

  res.json({
    loggedIn: true,
    user: req.session.user
  });

});

app.get('/test-login', async (req, res) => {
  const [users] = await db.query(
    `
    SELECT *
    FROM users
    WHERE email = ?
    AND password_hash = ?
    `,
    [
      'student1@gmail.com',
      '123456'
    ]
  );

  res.json(users);
});

app.post(
  '/create-booking',
  async (req, res) => {

    const {
      studentId,
      mentorId,
      bookingDate,
      bookingTime,
      notes
    } = req.body;

    const [result] =
      await db.query(
        `
        INSERT INTO bookings
        (
          student_id,
          mentor_id,
          booking_date,
          booking_time,
          notes
        )
        VALUES
        (
          ?,
          ?,
          ?,
          ?,
          ?
        )
        `,
        [
          studentId,
          mentorId,
          bookingDate,
          bookingTime,
          notes
        ]
      );

    res.json({
      success: true,
      bookingId:
        result.insertId
    });
  });

app.post('/payment', async (req, res) => {
  try {

    const {
      bookingId,
      amount,
      method
    } = req.body;

    console.log('PAYMENT BODY:', {
      bookingId,
      amount,
      method
    });

    const [result] = await db.query(
      `
      INSERT INTO payments
      (
        booking_id,
        amount,
        method,
        status
      )
      VALUES
      (
        ?,
        ?,
        ?,
        'paid'
      )
      `,
      [
        bookingId,
        amount,
        method
      ]
    );

    console.log('INSERT OK', result);

    await db.query(
      `
      UPDATE bookings
      SET status = 'confirmed'
      WHERE id = ?
      `,
      [bookingId]
    );

    res.json({
      success: true
    });

  } catch (err) {

    console.error('PAYMENT ERROR:', err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.get('/ping', (req, res) => {
  res.json({
    success: true
  });
});

app.listen(5005, () => {
  console.log('Server running on port 5005');
});