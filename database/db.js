const mysql = require('mysql2'); 
const mysql_promise = require('mysql2/promise'); 

const db = mysql.createPool({
  host: '192.168.207.194',     
  user: 'root',          
  password: '',  
  database: 'match_data',
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
  } else {
    console.log("Connected to MySQL!");
    connection.release(); // Release the connection back to the pool
  }
});
const db_promise = mysql_promise.createPool({
  host: '192.168.207.194',     
  user: 'root',          
  password: '',  
  database: 'match_data',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = { db, db_promise };
