const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const pool = require('./db_connection');

async function anime_manga(){
    try {
        const temp = await readFileAsync('../data/anime_manga_pair.json');
        const list = JSON.parse(temp);

        for(var i = 0; i < list.length; i++){
            const anime_id = list[i].animeID;
            const manga_id = list[i].mangaID;

            const q = await pool.query(
                `INSERT INTO anime_manga (anime_id, manga_id) VALUES ($1, $2)`,
                [anime_id, manga_id]
            );
            //console.log(q);
        }
    } catch (error) {
        console.log(error);
    }
}

async function anime_character(){
    try {
        const temp = await readFileAsync('../data/anime_character_pair.json');
        const list = JSON.parse(temp);

        for(var i = 0; i < list.length; i++){
            const anime_id = list[i].animeID;
            const character_id = list[i].characterID;

            const q = await pool.query(
                `INSERT INTO anime_character (anime_id, character_id) VALUES($1, $2)`,
                [anime_id, character_id]
            );
            //console.log(q);
        }
    } catch (error) {
        console.log(error);
    }
}

async function anime_studio(){
    try {
        const temp = await readFileAsync('../data/anime_studio_pair.json');
        const list = JSON.parse(temp);

        for(var i = 0; i < list.length; i++){
            const anime_id = list[i].animeID;
            const studio_id = list[i].studioID;
            const price = list[i].price;

            const q = await pool.query(
                `INSERT INTO anime_studio (anime_id, studio_id, price) VALUES($1, $2, $3)`,
                [anime_id, studio_id, price]
            );
            //console.log(q);
        }
    } catch (error) {
        console.log(error);
    }
}

async function anime_genre(){
    try {
        const temp = await readFileAsync('../data/anime_genre.json');
        const list = JSON.parse(temp);

        for(var i = 0; i < list.length; i++){
            const anime_id = list[i].animeID;
            const genre = list[i].genre;

            const q = await pool.query(
                `INSERT INTO anime_genre (anime_id, genre) VALUES($1, $2)`,
                [anime_id, genre]
            );
            //console.log(q);
        }
    } catch (error) {
        console.log(error);
    }
}

anime_manga();
//anime_character();
//anime_studio();
//anime_genre();