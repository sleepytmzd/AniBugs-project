const { promisify } = require('util');
const fs = require('fs');
const appendFileAsync = promisify(fs.appendFile);
const readFileAsync = promisify(fs.readFile);

const animelist = [];

async function fetchData(limit) {
    try {
        const temp = await readFileAsync('../data/emni.json');
        const list = JSON.parse(temp);

        for(let z = 0; z < list.length; z++){
            animelist.push(list[z]);
        }
    } catch (error) {
        console.error('Error reading file:', error);
    }
    //await appendFileAsync('../data/dummy_data.json', '[\n');
    for (let i = 0; i < animelist.length; i++) {
        // Introduce a delay between requests
        await new Promise(resolve => setTimeout(resolve, 1700));

        // Fetch data for the current iteration
        await hehe(animelist[i], animelist[animelist.length-1]);
    }
    await appendFileAsync('../data/dummy_data.json', ']');
}

async function hehe(n, limit) {
    var query = `
    query ($id: Int) { # Define which variables will be used in the query (id)
        Media (id: $id, type: ANIME, source: MANGA, isAdult: false) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
          id
          title {
            romaji
            english
            native
          }
          bannerImage
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

        console.log(data);
        if(data.errors == null){
            // Append each JSON object to the file
            await appendFileAsync('../data/dummy_data.json', JSON.stringify(data, null, 1) + (n < limit-2 ? ',\n' : '\n'));
        }
    } catch (error) {
        console.error(`Error fetching or appending data for id ${n}:`, error);
    }
}

// Start fetching data
fetchData(3800);
