const express = require('express');
const cors = require('cors')
const pool = require('./query_scripts/db_connection');

const app = express();
app.set('view engine', 'ejs');

var user_id = null;
var username = null;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.listen(5000, () => {
    console.log('server choltese');
});

//User login
app.get('/', (req, res) => {
    res.render('user_login');
    console.log('1 ' + user_id);
})

//Display user purchase history
app.get('/user_info', async (req, res) => {
    if(user_id == null){
        user_id = req.query.user_id;
    }
    console.log('2 ' + user_id);

    try {
        const q1 = await pool.query(
            `
            SELECT first_name || ' ' || last_name AS name FROM "user" WHERE id = $1
            `,[user_id]
        );
        username = q1.rows[0].name;
        console.log(username);

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
    var purchaseList;
    try {
        const q2 = await pool.query(
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
        );
        purchaseList = q2.rows;

    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    var total;
    try {
        const q3 = await pool.query(
            `
            SELECT SUM(S.price)
            FROM purchase P JOIN anime_studio S
            ON P.anime_id = S.anime_id
            JOIN anime A
            ON P.anime_id = A.id
            WHERE P.user_id = $1;
            `,[user_id]
        );
        total = q3.rows[0].sum;
        console.log('total: ' + total);
    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    
    res.render('user_info', {list: purchaseList, total: total, username: username});

})

app.get('/studio', (req, res) => {
    res.render('studio_login');
})

app.get('/studio/names', async (req, res) => {
    const name = req.query.studio_name;
    var studios;

    try {
        const q1 = await pool.query(
            `
            SELECT * FROM studio
            WHERE UPPER("name") LIKE $1;
            `, [`%${name.toUpperCase()}%`]
        );
        studios = q1.rows;
    } catch (error) {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    res.render('all_studio', { list: studios ,username: username})
    
})

//Display Studio sales history
app.get('/studio/:id', async (req, res) => {
    const studio_id = req.params.id;
    console.log(studio_id)

    try {
        const q1 = await pool.query(
            `
            SELECT S."name", A.romaji_title, A.english_title, SA.price
            FROM studio S JOIN anime_studio SA
            ON S.id = SA.studio_id
            JOIN anime A
            ON SA.anime_id = A.id
            WHERE S.id = $1
            ORDER BY A.visibility DESC
            `,[studio_id]
        );

        const q2 = await pool.query(
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
        );

        res.render('studio_info', {list: q1.rows, sales: q2.rows, username: username})

    } catch (error) {
        console.log(error);
    }


})

//Get an anime name
app.get('/anime', (req, res) => {
    console.log(user_id);
    res.render('get_anime');
})

// Display all animes by that name
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
})

// View details for a particular anime
app.get('/individual_anime/:id', async (req, res) => {
    const id = req.params.id;

    const anime = await pool.query(
        `
        SELECT * FROM anime WHERE id = $1
        `, [id]
    );

    var isPurchased = false;
    const status = await pool.query(
        `
        SELECT * FROM purchase
        WHERE user_id = $1 AND anime_id = $2;
        `,[user_id, id]
    );
    if(status.rows != 0){
        isPurchased = true;
    }
    console.log('isPurchased: ' + isPurchased)

    res.render('anime_info', {anime: anime.rows[0], isPurchased: isPurchased, username: username})
})

// Purchase a particular anime
app.get('/purchase_anime/:id', (req, res) => {
    const anime_id = req.params.id;

    pool.query(
        `
        INSERT INTO purchase (user_id, anime_id, watched) VALUES ($1, $2, $3)
        `,[user_id, anime_id, 'f']
    )
    .then(result => {
        res.redirect('/individual_anime/' + anime_id);
    })
    .catch(error => {
        console.error('error executing query: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    })
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

app.get('/logout', (req,res) => {
    user_id = null;
    username = null;
    res.redirect('/');
})