const { promisify } = require('util');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const genres = [];
const anime_genre_pair = [];
const manga_genre_pair = [];

async function fetchdata(){
    var query = `
    { # Define which variables will be used in the query (id)
        GenreCollection
    }
    `;

    var url = 'https://graphql.anilist.co';
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        console.log(data);
        for(var i = 0; i < data.data.GenreCollection.length; i++){
            genres.push({id: i+1, name: data.data.GenreCollection[i]});
        }
        console.log(genres);
    } catch (error) {
        console.error(error);
    }

    await writeFileAsync('../data/genres.json', JSON.stringify(genres, null, 1));
}

async function hehe(){
    /*try {
        const temp = await readFileAsync('../data/anime_data_2.json');
        const jsondata = JSON.parse(temp);
        const animelist = jsondata.animes;

        for(var i = 0; i < animelist.length; i++){
            const genrelist = animelist[i].data.Media.genres;
            for(var j = 0; j < genrelist.length; j++){
                anime_genre_pair.push({animeID: animelist[i].data.Media.id, genre: genrelist[j]});
            }
        }

        await writeFileAsync('../data/anime_genre.json', JSON.stringify(anime_genre_pair, null, 1));
    } catch (error) {
        console.log(error);
    }*/

    try {
        const temp = await readFileAsync('../data/manga_data.json');
        const jsondata = JSON.parse(temp);
        const mangalist = jsondata.mangas;

        for(var i = 0; i < mangalist.length; i++){
            const genrelist = mangalist[i].data.Media.genres;
            for(var j = 0; j < genrelist.length; j++){
                manga_genre_pair.push({mangaID: mangalist[i].data.Media.id, genre: genrelist[j]});
            }
        }

        await writeFileAsync('../data/manga_genre.json', JSON.stringify(manga_genre_pair, null, 1));
    } catch (error) {
        console.log(error);
    }
}

// Start fetching data
//await fetchdata();
hehe();
