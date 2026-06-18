const mysql = require('mysql2/promise');

// make database entry with the following username and database name
const pool = mysql.createPool({
  host: 'localhost',
  user: 'mentorlink_user',
  // make your own password
  password: '<password>',
  database: 'mentorlink'
});

module.exports = pool;