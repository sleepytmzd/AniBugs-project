const { promisify } = require('util');
const fs = require('fs');
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

const studiolist = [];
const anime_studio_pair = [];

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

async function fetchdata(){
    try {
        const temp = await readFileAsync('../data/anime_data_2.json');
        const jsondata = JSON.parse(temp);
        const animelist = jsondata.animes;

        for(var i = 0; i < animelist.length; i++){
            const studios = animelist[i].data.Media.studios.nodes;
            console.log(studios.length);
            for(var j = 0; j < studios.length; j++){
                if(studios[j].isAnimationStudio){
                    anime_studio_pair.push({animeID: animelist[i].data.Media.id, studioID: studios[j].id, price: randomNumber(1, 10)});
                    if(studiolist.find(ele => ele.id == studios[j].id)){
                        continue;
                    }
                    studiolist.push(studios[j]);
                }
            }
        }

    } catch (error) {
        console.log(error);
    }

    //console.log(studiolist);
    console.log(studiolist.length);
    //console.log(anime_studio_pair);
    console.log(anime_studio_pair.length);

    const studiolistjson = JSON.stringify(studiolist, null, 1);
    const anime_studio_pair_json = JSON.stringify(anime_studio_pair, null, 1);
    
    await writeFileAsync('../data/studio_data.json', studiolistjson);
    await writeFileAsync('../data/anime_studio_pair.json', anime_studio_pair_json);
}

fetchdata();