const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',       // Your database host, typically 'localhost'
  user: 'root',   // Your MySQL username (e.g., root)
  password: '', // Your MySQL password
  database: 'daily-task' // The database name you want to connect to
});

module.exports = pool;