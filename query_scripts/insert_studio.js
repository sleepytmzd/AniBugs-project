const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const pool = require('./db_connection');

async function hehe(){
    try {
        const temp = await readFileAsync('../data/studio_data.json');
        const studiolist = JSON.parse(temp);

        for(var i = 0; i < studiolist.length; i++){
            const id = studiolist[i].id;
            const name= studiolist[i].name;

            const q = await pool.query(
                `INSERT INTO studio (id, name) VALUES ($1, $2)
                `, [id, name]
            );

            //console.log(q);
        }
    } catch (error) {
        console.log(error);
    }
}

hehe();