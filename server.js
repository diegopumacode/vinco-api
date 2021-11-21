const express = require('express')
const cors = require('cors')

const app = express()

let corsOptions = {
    origin: 'http://localhost:3000'
}

app.use(cors(corsOptions))

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

// Initial Route
app.get('/', (req, res) => {
    res.send( "API running /_(--)_/" )
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});