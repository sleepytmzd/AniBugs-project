const { promisify } = require('util');
const fs = require('fs');
const appendFileAsync = promisify(fs.appendFile);
const readFileAsync = promisify(fs.readFile);
const pool = require('./db_connection');

async function hehe(){
    try {
        const temp = await readFileAsync('../data/anime_data_2.json');
        const jsondata = JSON.parse(temp);
        const animelist = jsondata.animes;

        for(var i = 0; i < animelist.length; i++){
            const id = animelist[i].data.Media.id;
            const romaji_title = animelist[i].data.Media.title.romaji;
            const english_title = animelist[i].data.Media.title.english;
            const description = animelist[i].data.Media.description;
            const status = animelist[i].data.Media.status;
            const season = animelist[i].data.Media.season;
            const episodes = animelist[i].data.Media.episodes;
            const duration = animelist[i].data.Media.duration;
            const startDate = animelist[i].data.Media.startDate;
            const endDate = animelist[i].data.Media.endDate;
            var sd = startDate.year + '-' + startDate.month + '-' + startDate.day;
            if(startDate.year == null || startDate.month == null || startDate.day == null){
                sd = null;
            }
            var ed = endDate.year + '-' + endDate.month + '-' + endDate.day;
            if(endDate.year == null || endDate.month == null || endDate.day == null){
                ed = null;
            }

            //console.log(sd + '\n' + ed);

            const q = await pool.query(
                `INSERT INTO anime (id, romaji_title, english_title, description, status, season, episodes, duration, start_date, end_date)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `, [id, romaji_title, english_title, description, status, season, episodes, duration, sd, ed]
            );

            //console.log(q);
        }
    } catch (error) {
        console.log(error);
    }

    //const description = 'database kortesi'
    //const newtodo = await pool.query('INSERT INTO list (description) VALUES ($1)', [description]);
    //console.log(newtodo);
}

hehe();