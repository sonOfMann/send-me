var mysql = require('mysql'),
connection = {
    host: 'localhost',
    user: 'root',
    password: 'rootMask707.',
    database: 'sendme'
},
tables = [
    "CREATE TABLE sessions( sid VARCHAR( 255) NOT NULL PRIMARY KEY, session VARCHAR( 1000) NOT NULL, expires VARCHAR( 100) NOT NULL)",
    "CREATE TABLE users( id INT( 15) NOT NULL PRIMARY KEY AUTO_INCREMENT, firstname VARCHAR( 300) NOT NULL, lastname VARCHAR( 300) NOT NULL, email VARCHAR( 300) UNIQUE NOT NULL, phone VARCHAR( 300) NOT NULL, password VARCHAR( 300) NOT NULL, address VARCHAR( 1000) NOT NULL, suite VARCHAR( 300), city VARCHAR( 300) NOT NULL, state VARCHAR( 300) NOT NULL, zip VARCHAR( 100) NOT NULL, registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    "CREATE TABLE profile( id INT( 15) NOT NULL PRIMARY KEY AUTO_INCREMENT, email VARCHAR( 300) NOT NULL, picks VARCHAR( 1000) NOT NULL, status VARCHAR( 100))",
    "CREATE TABLE errands( id INT( 15) NOT NULL PRIMARY KEY AUTO_INCREMENT, email VARCHAR( 300) NOT NULL, name VARCHAR( 255) NOT NULL, description VARCHAR( 1000) NOT NULL, price VARCHAR( 100) NOT NULL, hname VARCHAR( 100) NOT NULL, hnumber VARCHAR( 100) NOT NULL)", 
    "CREATE TABLE office( id INT( 15) NOT NULL PRIMARY KEY AUTO_INCREMENT, email VARCHAR( 500) NOT NULL, password VARCHAR( 1000) NOT NULL)",
], 
con = mysql.createConnection(connection);
for (let index = 0; index < tables.length; index++) {
    const table = tables[index];
    con.query( table, ( err, row) => {
        console.log(row);
    });
}
con.end()
console.log('Finished');