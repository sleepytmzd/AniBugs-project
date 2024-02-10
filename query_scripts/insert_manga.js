const { promisify } = require('util');
const fs = require('fs');
const appendFileAsync = promisify(fs.appendFile);
const readFileAsync = promisify(fs.readFile);
const pool = require('./db_connection');

async function hehe(){
    try {
        const temp = await readFileAsync('../data/manga_data.json');
        const jsondata = JSON.parse(temp);
        const mangalist = jsondata.mangas;

        for(var i = 0; i < mangalist.length; i++){
            const id = mangalist[i].data.Media.id;
            const romaji_title = mangalist[i].data.Media.title.romaji;
            const english_title = mangalist[i].data.Media.title.english;
            const description = mangalist[i].data.Media.description;
            const status = mangalist[i].data.Media.status;
            const volumes = mangalist[i].data.Media.volumes;
            const chapters = mangalist[i].data.Media.chapters;
            const startDate = mangalist[i].data.Media.startDate;
            const endDate = mangalist[i].data.Media.endDate;
            const imagelink = mangalist[i].data.Media.coverImage.large;
            const bannerlink = mangalist[i].data.Media.bannerImage;
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
                `INSERT INTO manga (id, romaji_title, english_title, description, status, volumes, chapters, start_date, end_date, imagelink, bannerlink)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                `, [id, romaji_title, english_title, description, status, volumes, chapters, sd, ed, imagelink, bannerlink]
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