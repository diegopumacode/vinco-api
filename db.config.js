const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database/users.db', (err) => {
    if (err) {
        console.error("Erro opening database " + err.message);
    } else {
        db.run('CREATE TABLE IF NOT EXISTS users( \
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,\
            lastName NVARCHAR(20)  NOT NULL,\
            firstName NVARCHAR(20)  NOT NULL,\
            occupation NVARCHAR(20),\
            age INTEGER,\
            status INTEGER\
        )', (err) => {
            console.log(err)
            
        });
    }
});

module.exports = db;