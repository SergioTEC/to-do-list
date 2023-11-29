const mysql = require('mysql2')

// Creates a connection to the MySQL database 
const connection = mysql.createConnection({
    host: 'localhost:3306',
    user: 'todolist',
    password: 'Spit@Fire8812',
    database: 'todolistdb',
})

// Exports the connection for use in other modules
module.exports = connection