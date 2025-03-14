const mysql = require('mysql2'); 
const mysql_promise = require('mysql2/promise'); 

const db = mysql.createPool({
  host: 'localhost',     
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
  host: 'localhost',     
  user: 'root',          
  password: '',  
  database: 'match_data',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = { db, db_promise };
