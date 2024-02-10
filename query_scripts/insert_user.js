const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const pool = require('./db_connection');

async function hehe(){
    try {
        const temp = await readFileAsync('../data/user_data.json');
        const userlist = JSON.parse(temp);
        
        for(var i = 0; i < userlist.length; i++){
            const id = userlist[i].id;
            const first_name = userlist[i].first_name;
            const last_name = userlist[i].last_name;
            const email = userlist[i].email;
            const gender = userlist[i].gender;
            const joined = userlist[i].joined;
            const avatar = userlist[i].avatar;

            //console.log(joined);

            const q = await pool.query(
                `INSERT INTO "user" (id, first_name, last_name, email, gender, joined, avatarlink)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [id, first_name, last_name, email, gender, joined, avatar]
            );

            //console.log(q);
        }
    } catch (error) {
        console.log(error);
    }
}

hehe();