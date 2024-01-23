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
        //console.log(animelist);
        
        for(var i = 0; i < userlist.length; i++){
            const limit = randomNumber(10, 100);
            for(var j = 0; j < limit; j++){
                var watched = false;
                if(j <= limit/2){
                    watched = true;
                }
                const q = await pool.query(
                    `
                    INSERT INTO purchase (user_id, anime_id, watched) VALUES ($1, $2, $3)
                    `, [userlist[i].id, animelist[j].id, watched]
                );
            }

            for(var j = limit + 1; j < limit + 6; j++){
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