const express = require('express')
const cors = require('cors')

const sqlite3 = require('sqlite3').verbose();

const app = express()
const db = require("./db.config.js")


let corsOptions = {
    origin: 'http://localhost:3000'
}

app.use(cors(corsOptions))

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

// Initial Route
app.get('/', (req, res) => {
    res.send("API running /_(--)_/")
})

app.get("/user", (req, res, next) => {
    db.get(`SELECT * FROM users`, [], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.status(200).json({ ok: true, data: row || [] });
    });
});

app.post("/user/", (req, res, next) => {
    var reqBody = req.body;
    db.run(`INSERT INTO users(lastName, firstName, occupation, age, status) VALUES (?,?,?,?,?)`,
        [reqBody.lastName, reqBody.firstName, reqBody.occupation, reqBody.status,reqBody.age],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }
            res.status(201).json({
                "id": this.lastID
            })
        });
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

