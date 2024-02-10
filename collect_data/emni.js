const { promisify } = require('util');
const fs = require('fs');
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

const animelist = [];
const remainingmangas = [];

async function hehe(){
    try {
        const temp = await readFileAsync('../data/character_data.json');
        const characterlist = JSON.parse(temp);

        let max = 0;
        let bruh;
        for(let z = 0; z < characterlist.length; z++){
            //if(characterlist[z].description != null && characterlist[z].description.length > max){
            if(characterlist[z].id > max){
                max = characterlist[z].id;
                //bruh = characterlist[z].description;
            }
        }

        console.log(max);
    } catch (error) {
        console.error('Error reading file:', error);
    }

    /*try {
        const temp = await readFileAsync('../data/manga_data.json');
        const mangalist = JSON.parse(temp).mangas;
        const temp2 = await readFileAsync('../data/mangalist.json');
        const list = JSON.parse(temp2);

        for(let i = 0; i < list.length; i++){
            if(mangalist.find(ele => ele.data.Media.id == list[i])){
                continue;
            }
            remainingmangas.push(list[i]);
        }

        await writeFileAsync('../data/remaining_mangas.json', JSON.stringify(remainingmangas, null, 1));
    } catch (error) {
        console.error('Error reading file:', error);
    }*/
}

hehe();

