const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',       // Your database host, typically 'localhost'
  user: 'root',   // Your MySQL username (e.g., root)
  password: 'view252366', // Your MySQL password
  database: 'daily_task' // The database name you want to connect to
});

module.exports = pool;