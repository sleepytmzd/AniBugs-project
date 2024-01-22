const { promisify } = require('util');
const fs = require('fs');
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

const characters = [];
const anime_character_pair = [];

async function fetchData(){
    var max = 0;
    try {
        const temp = await readFileAsync('../data/anime_data_2.json');
        const jsondata = JSON.parse(temp);
        const animelist = jsondata.animes;

        //console.log(animelist.length);
        for(var i = 0; i < animelist.length; i++){
            //console.log(animelist[i].data.Media.characters.nodes.length);
            const nodes = animelist[i].data.Media.characters.nodes;
            for(var j = 0; j < nodes.length; j++){
                if(nodes[j].description){
                    if(nodes[j].description.length > max){
                        max = nodes[j].description.length;
                    }
                }
                anime_character_pair.push({animeID: animelist[i].data.Media.id, characterID: nodes[j].id});
                if(characters.find(ele => ele.id == nodes[j].id)){
                    continue;
                }
                characters.push(nodes[j]);
            }
        }
    } catch (error) {
        console.log(error);
    }
    console.log(characters.length);
    console.log(anime_character_pair.length);
    console.log(max);
    //console.log(characters);

    const pairjson = JSON.stringify(anime_character_pair, null, 1);
    const listjson = JSON.stringify(characters, null, 1);
    await writeFileAsync('../data/character_data.json', listjson);
    await writeFileAsync('../data/anime_character_pair.json', pairjson);
}

fetchData();