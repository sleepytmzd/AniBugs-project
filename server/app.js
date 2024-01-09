const express = require('express');
const pool = require('./query_scripts/db_connection');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.listen(5000, () => {
    console.log('server choltese');
});

app.post('/add', (req, res) => {
    console.log(req.body);
    
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const gender = req.body.gender;
    const joined = req.body.joined;

    pool.query(
        `INSERT INTO "user" (first_name, last_name, email, gender, joined)
        VALUES ($1, $2, $3, $4, $5)`,[first_name, last_name, email, gender, joined]
    )
    .then(result => {
        console.log(result.rows);
        res.send('added');
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
})

app.post('/anime', (req, res) => {
    const id = req.body.id;
    pool.query(
        `SELECT * FROM anime WHERE id = $1`, [id]
    )
    .then(result => {
        console.log(result.rows);
        res.json(result.rows);
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
});


app.get('/get_anime/:id', (req, res) => {
    const id = req.params.id;
    pool.query(
        `SELECT * FROM anime WHERE id = $1`, [id]
    )
    .then(result => {
        console.log(result.rows);
        res.json(result.rows);
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
});