const mysql = require('mysql');
const migration = require('mysql-migrations');

const connection = mysql.createPool({
    connectionLimit : 10,
    host     : 'localhost',
    user     : 'user',
    password : 'password',
    database : 'db'
});

migration.init(connection, __dirname + '/migrations');
