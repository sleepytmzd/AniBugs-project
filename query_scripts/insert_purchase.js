const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const pool = require('./db_connection');

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

async function hehe(){
    try {
        const temp = await readFileAsync('../data/user_data.json');
        const userlist = JSON.parse(temp);

        const result = await pool.query(
            `
            SELECT id FROM anime
            ORDER BY visibility DESC
            `,[]
        );

        const animelist = result.rows;
        console.log(animelist);
        
        for(var i = 0; i < 1000; i++){
            //const limit = randomNumber(10, 100);
            for(var j = i; j < userlist.length; j++){
                var watched = false;
                if(randomNumber(1,10) % 2 == 0){
                    watched = true;
                }
                const q = await pool.query(
                    `
                    INSERT INTO purchase (user_id, anime_id, watched) VALUES ($1, $2, $3)
                    `, [userlist[j].id, animelist[i].id, watched]
                );
            }
        }

        for(let i = 0; i < userlist.length; i++){
            for(let j = i+1; j <= i+5; j++){
                const q = await pool.query(
                    `
                    INSERT INTO bookmarks (user_id, anime_id) VALUES ($1, $2)
                    `,[userlist[i].id, animelist[j].id]
                );
            }
        }
    } catch (error) {
        console.log(error);
    }
}

hehe();