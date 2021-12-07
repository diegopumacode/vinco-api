const express = require('express')
const cors = require('cors')

const sqlite3 = require('sqlite3').verbose();

const app = express()
const db = require("./db.config.js")

let corsOptions = {
    origin: 'https://vinco-front.vercel.app'
}

app.use(cors(corsOptions))

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

// Initial Route
app.get('/', (req, res) => {
    res.send("API running /_(--)_/")
})

// Get All users
app.get("/user", (req, res, next) => {
    db.all(`SELECT * FROM users`, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        let data = []
        rows.forEach(function (row) {
            data.push(row)
        })
        res.status(200).send(data || []);
    });
});

// Get user by id
app.get("/user/:id", (req, res, next) => {
    db.get(`SELECT * FROM users where id=?`, [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (!row) {
            res.json([]);
            return;
        }
        res.json(row);
    });
});

// Create User
app.post("/user/", (req, res, next) => {
    let reqBody = req.body;
    db.run(`INSERT INTO users(lastName, firstName, occupation, age, status) VALUES (?,?,?,?,?)`,
        [reqBody.lastName, reqBody.firstName, reqBody.occupation, reqBody.age, 1],
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }
            res.status(201).json({
                id: this.lastID
            })
        });
});

// Update user
app.put('/user/:id', function (req, res) {
    let { lastName, firstName, occupation, age, status } = req.body;
    db.serialize(() => {
        db.run('UPDATE users SET lastName=? , firstName=? , occupation=? , age = ?, status = ? WHERE id = ?',
            [lastName, firstName, occupation, age, status, req.params.id], function (err) {
                if (err) {
                    res.send("Error while updating");
                    return console.error(err.message);
                }
                res.send({ ok: true, message: "Entry updated successfully" });
            });
    });
});

// Delete user
app.delete('/user/:id', function (req, res) {
    db.serialize(() => {
        db.run('UPDATE users SET status=false WHERE id = ?',
            [req.params.id], function (err) {
                if (err) {
                    res.send("Error while deleting");
                    return console.error(err.message);
                }
                res.send({ ok: true, message: "Entry delete successfully" });
            });
    });
});

// Activate user
app.put('/user/:id/active', function (req, res) {
    db.serialize(() => {
        db.run('UPDATE users SET status=true WHERE id = ?',
            [req.params.id], function (err) {
                if (err) {
                    res.send("Error while deleting");
                    return console.error(err.message);
                }
                res.send({ ok: true, message: "Entry delete successfully" });
            });
    });
});

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

