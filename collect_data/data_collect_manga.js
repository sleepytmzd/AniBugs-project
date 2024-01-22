const { promisify } = require('util');
const fs = require('fs');
const appendFileAsync = promisify(fs.appendFile);
const readFileAsync = promisify(fs.readFile);

const manga_list = [];
var count = 1;

async function fetchData() {
    try {
            // get the mangalist from anime_manga_pair, then make query for all items in the list and save the manga data
        
        const temp = await readFileAsync('../data/anime_manga_pair.json');
        const pairs = JSON.parse(temp);
        console.log(pairs.length);

        for(var i = 0; i < pairs.length; i++){
            if(manga_list.find(ele => ele == pairs[i].mangaID)){
                continue;
            }
            manga_list.push(pairs[i].mangaID);
        }
    
        console.log(manga_list);
    } catch (error) {
        console.error('Error reading file:', error);
    }

    await appendFileAsync('../data/manga_data.json', '{"mangas": [\n');
    for (let i = 0; i < manga_list.length; i++) {
        // Introduce a delay between requests
        await new Promise(resolve => setTimeout(resolve, 670));

        // Fetch data for the current iteration
        await hehe(manga_list[i], manga_list.length);
    }
    await appendFileAsync('../data/manga_data.json', ']}');
}

async function hehe(n, limit) {
    var query = `
    query ($id: Int){ # Define which variables will be used in the query (id)
        Media (id: $id) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
          id
          title {
            romaji
            english
            native
          }
          description
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          format
          status
          source
          chapters
          volumes
          coverImage {
            extraLarge
            large
            medium
            color
          }
          genres
          popularity
          favourites
        }
      }
    `;

    var variables = {
        id: n
    };

    var url = 'https://graphql.anilist.co';
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if(data.errors == null){
            // Append each JSON object to the file
            console.log(count + ' ' + limit);
            await appendFileAsync('../data/manga_data.json', JSON.stringify(data) + (count < limit ? ',\n' : '\n'));
            count++;
        }
    } catch (error) {
        console.error(`Error fetching or appending data for id ${n}:`, error);
    }
}

// Start fetching data
fetchData();

