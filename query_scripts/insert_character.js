const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const pool = require('./db_connection');

async function hehe(){
    try {
        const temp = await readFileAsync('../data/character_data.json');
        const characterlist = JSON.parse(temp);
        
        for(var i = 0; i < characterlist.length; i++){
            const id = characterlist[i].id;
            const name = characterlist[i].name.full;
            const gender = characterlist[i].gender;
            const description = characterlist[i].description;

            const q = await pool.query(
                `INSERT INTO "character" (id, name, gender, description)
                    VALUES ($1, $2, $3, $4)
                `, [id, name, gender, description]
            );

            //console.log(q);
        }
    } catch (error) {
        console.log(error);
    }
}

hehe();