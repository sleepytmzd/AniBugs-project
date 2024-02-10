const { promisify } = require('util');
const fs = require('fs');
const appendFileAsync = promisify(fs.appendFile);

async function fetchData(start, limit) {
    await appendFileAsync('../data/anime_data_2.json', '{"animes": [\n');
    for (let i = start; i < limit+1; i++) {
        // Introduce a delay between requests
        await new Promise(resolve => setTimeout(resolve, 1600));

        // Fetch data for the current iteration
        await hehe(i, limit);
    }
    await appendFileAsync('../data/anime_data_2.json', ']}');
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
          season
          status
          episodes
          duration
          source
          chapters
          volumes
          trailer {
            id
            site
            thumbnail
          }
          coverImage {
            extraLarge
            large
            medium
            color
          }
          genres
          characters {
            nodes {
              id
              name {
                full
              }
              image {
                large
              }
              description
              gender
              dateOfBirth {
                year
                month
                day
              }
              age
              favourites
            }
          }
          popularity
          favourites
          studios {
            nodes {
              id
              name
              isAnimationStudio
              favourites
            }
          }
          relations {
            nodes {
              id
              format
            }
          }
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
            await appendFileAsync('../data/anime_data_2.json', JSON.stringify(data, null, 1) + (n < limit-1 ? ',\n' : '\n'));
            console.log(data.data.Media.id);
        }
    } catch (error) {
        console.error(`Error fetching or appending data for id ${n}:`, error);
    }
}

// Start fetching data
fetchData(1, 5000);
