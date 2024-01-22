const fs = require('fs');

const manga_list = [];
const anime_manga_pair = [];

fs.readFile('../data/anime_data_2.json', (err, data) => {

        // get the mangalist from the relations section under anime, create anime_manga_pair and save it

    if(err){
        console.log(err);
    }
    const an = JSON.parse(data);
    const anime_list = an.animes;
    console.log(anime_list.length);
    for(var i = 0; i < anime_list.length; i++){
        //console.log(anime_list[i].data.Media.relations.nodes.length);
        const relation_nodes = anime_list[i].data.Media.relations.nodes;
        for(var j = 0; j < relation_nodes.length; j++){
            if(relation_nodes[j].format == "MANGA"){
                //console.log('Manga id: ' + relation_nodes[j].id);
                anime_manga_pair.push({animeID: anime_list[i].data.Media.id, mangaID: relation_nodes[j].id});
                if(manga_list.find(ele => ele == relation_nodes[j].id)){
                    continue;
                }
                manga_list.push(relation_nodes[j].id);
            }
        }
    }

    console.log(manga_list.length);
    console.log(anime_manga_pair.length);

    const pair_json = JSON.stringify(anime_manga_pair, null, 1);
    fs.writeFile('../data/anime_manga_pair.json', pair_json, () => {
        console.log('done');
    });
})
