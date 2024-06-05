const mysql = require("mysql");

const db = mysql.createConnection({
  connectionLimit: 10,
  host: "localhost",
  user: "baam",
  password: "baam123",
  database: "lab3",
  port: 3307,
});

module.exports = db;
