const express = require('express');
const pool = require('./query_scripts/db_connection');

const app = express();
app.set('view engine', 'ejs');

var user_id = null;
var username = null;

app.use(express.urlencoded({ extended: true }));

app.listen(5000, () => {
    console.log('server choltese');
});

app.get('/', (req, res) => {
    res.render('user_login');
    console.log(user_id);
})

app.get('/user_info', (req, res) => {
    if(user_id == null){
        user_id = req.query.user_id;
    }
    console.log(user_id);

    pool.query(
        `
        SELECT first_name || ' ' || last_name AS name FROM "user" WHERE id = $1
        `,[user_id]
    )
    .then(result => {
        username = result.rows[0].name;
        console.log(username);

        pool.query(
            `  
            SELECT P.user_id, P.anime_id, A.romaji_title, A.english_title, SUM(S.price)
            FROM purchase P JOIN anime_studio S
            ON P.anime_id = S.anime_id
            JOIN anime A
            ON P.anime_id = A.id
            WHERE P.user_id = $1
            GROUP BY P.user_id, P.anime_id, A.romaji_title, A.english_title, A.visibility
            ORDER BY A.visibility DESC;
            `, [user_id]
        )
        .then(result => {
            //console.log(result.rows);
            res.render('user_info', {list: result.rows, username: username});
        })
        .catch(error => {
            console.error('error executing query: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        })
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })

})

app.get('/anime', (req, res) => {
    console.log(user_id);
    res.render('get_anime');
})

app.get('/add_user', (req, res) => {
    res.render('add_user');
})

app.get('/delete_user', (req, res) => {
    res.render('delete_user');
})

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
        res.send('<h1>added</h1>');
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
})

app.post('/delete', (req, res) => {
    console.log(req.body);
    
    const id = req.body.id;

    pool.query(
        `DELETE FROM "user" WHERE id = $1`,[id]
    )
    .then(result => {
        console.log(result.rows);
        res.send('<h1>deleted</h1>');
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
})

app.get('/anime_info', (req, res) => {
    console.log(user_id, username);
    
    const name = req.query.name;
    console.log(name);
    pool.query(
        `SELECT *
        FROM anime
        WHERE UPPER(romaji_title) LIKE $1 OR UPPER(english_title) LIKE $2`, [`%${name.toUpperCase()}%`, `%${name.toUpperCase()}%`]
    )    
    .then(result => {
        console.log(result.rows);
        //res.json(result.rows[0]);
        res.render('all_anime', {animelist: result.rows, username: username});
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
});

app.get('/individual_anime/:id', (req, res) => {
    const id = req.params.id;

    pool.query(
        `
        SELECT * FROM anime WHERE id = $1
        `, [id]
    )
    .then(result => {
        console.log(result.rows);
        res.render('anime_info', {anime: result.rows[0], username: username})
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
})

app.get('/logout', (req,res) => {
    user_id = null;
    username = null;
    res.redirect('/');
})