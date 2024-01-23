const express = require('express');
const cors = require('cors')
const pool = require('./query_scripts/db_connection');

const app = express();

var user_id = null;
var username = null;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.listen(5000, () => {
    console.log('server choltese');
});

// Get profile info of user: Make a GET request to this route with the user_id (between 1-1000) as a query parameter
app.get('/user/profile', (req, res) => {
    if(user_id == null){
        user_id = req.query.user_id;
    }
    console.log('user_id: ' + user_id);

    pool.query(
        `
        SELECT * FROM "user" WHERE id = $1
        `, [user_id]
    )
    .then(result => {
        res.json(result.rows);
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
})

//Get user purchase history: Make a GET request to this route with the user_id (between 1-1000) as a query parameter
app.get('/user/purchase_history', (req, res) => {
    if(user_id == null){
        user_id = req.query.user_id;
    }
    console.log('user_id: ' + user_id);
    
    pool.query(
        `
        SELECT first_name || ' ' || last_name AS name FROM "user" WHERE id = $1
        `,[user_id]
    )
    .then(result => {
        username = result.rows[0].name;
        console.log('username: ' + username);

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
            res.json(result.rows);
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

//Get Studio anime list: Make a GET request to this route with the studio_id as a query parameter
app.get('/studio_info/animelist', (req, res) => {
    const studio_id = req.query.studio_id;

    pool.query(
         `
        SELECT S."name", A.romaji_title, A.english_title, SA.price
        FROM studio S JOIN anime_studio SA
        ON S.id = SA.studio_id
        JOIN anime A
        ON SA.anime_id = A.id
        WHERE S.id = $1
        ORDER BY A.visibility DESC
        `,[studio_id]
    )
    .then(result => {
        res.json(result.rows);
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })

})

//Get Studio sales list: Make a GET request to this route with the studio_id as a query parameter
app.get('/studio_info/saleslist', (req, res) => {
    const studio_id = req.query.studio_id;

    pool.query(
        `
        SELECT S."name", A.romaji_title, A.english_title, SUM(SA.price), COUNT(P.user_id)
        FROM studio S JOIN anime_studio SA
        ON S.id = SA.studio_id
        JOIN anime A
        ON SA.anime_id = A.id
        JOIN purchase P
        ON SA.anime_id = P.anime_id
        WHERE S.id = $1
        GROUP BY S.id, S."name", A.id, A.romaji_title, A.english_title
        ORDER BY A.visibility DESC;
        `,[studio_id]
    )
    .then(result => {
        res.json(result.rows);
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
        
})

// Get all animes by that name: Make a GET request to this route with the anime name as a query parameter
app.get('/anime_info', (req, res) => {
    const name = req.query.name;
    console.log(name);

    pool.query(
        `SELECT *
        FROM anime
        WHERE UPPER(romaji_title) LIKE $1 OR UPPER(english_title) LIKE $2`, [`%${name.toUpperCase()}%`, `%${name.toUpperCase()}%`]
    )    
    .then(result => {
        //console.log(result.rows);
        res.json(result.rows);
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
});

// View details for a particular anime: Make a GET request to this route with the anime name as a request parameter
// Just append the anime_id in the id placeholder 
app.get('/individual_anime/:id', (req, res) => {
    const id = req.params.id;

    pool.query(
        `
        SELECT * FROM anime WHERE id = $1
        `, [id]
    )
    .then(result => {
        //console.log(result.rows);
        res.json(result.rows);
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
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

app.get('/logout', (req,res) => {
    user_id = null;
    username = null;
    res.redirect('/');
})