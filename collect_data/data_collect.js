// Here we define our query as a multi-line string
// Storing it in a separate .graphql/.gql file is also possible

const fs = require('fs');

var n = 0;

function hehe(){
    var query = `
    query ($id: Int) { # Define which variables will be used in the query (id)
        Media (id: $id, type: ANIME) { # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
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
        characters{
            nodes{
            id
            }
        }
        popularity
        favourites
        studios{
            nodes{
            id
            }
        }
        }
    }
    `;

    // Define our query variables and values that will be used in the query request
    n++;
    var variables = {
        id: n
    };

    // Define the config we'll need for our Api request
    var url = 'https://graphql.anilist.co',
        options = {
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

    // Make the HTTP Api request
    fetch(url, options).then(handleResponse)
                    .then(handleData)
                    .catch(handleError);

    function handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    }

    function handleData(data) {
        //if(data.errors == null){
            //console.log(data);
        
            fs.appendFile('./anime_data.json', JSON.stringify(data) + '\n,', () => {
                //console.log(data);
            })
        //}

    }

    function handleError(error) {
        //alert('Error, check console');
        console.log(n);
        console.error(error);
    }
}

for(var i = 1; i < 50; i++){
    setTimeout(hehe, 5000);
}