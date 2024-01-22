const { promisify } = require('util');
const fs = require('fs');
const appendFileAsync = promisify(fs.appendFile);

async function fetchData(limit) {
    await appendFileAsync('../data/dummy_data.json', '{"animes": [\n');
    for (let i = 1; i < limit+1; i++) {
        // Introduce a delay between requests
        await new Promise(resolve => setTimeout(resolve, 670));

        // Fetch data for the current iteration
        await hehe(i, limit);
    }
    await appendFileAsync('../data/dummy_data.json', ']}');
}

async function hehe(n, limit) {
    var query = `
    query ($id: Int) {
        Media(id: $id, type: ANIME, source: MANGA, isAdult: false) {
          id
          title {
            romaji
            english
            native
          }
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
            await appendFileAsync('../data/dummy_data.json', JSON.stringify(data, null, 1) + (n < limit-2 ? ',\n' : '\n'));
        }
    } catch (error) {
        console.error(`Error fetching or appending data for id ${n}:`, error);
    }
}

// Start fetching data
fetchData(5000);
