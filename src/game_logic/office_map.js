import { k } from './kaboomCtx.js';
// import { createInteraction } from './interaction.js';
// import { seconds } from './utils.js';
import { createSpawnPoint } from './spawn_point.js';

// load the character assets 

// player + player face ( do that later )

// receptionist + receptionist face 

k.loadSprite('receptionist', './src/assets/receptionist.png', {
    sliceX: 4, 
    sliceY: 1,
    anims: {
        'down': 0,
        'up': 1,
        'right': 2,
        'left': 3
    }
});



// shogun boss + shogun face


// worker one ( does nothing )

// worker two ( tweens - goes to grab coffee )

// load the map
const mapSprite = k.loadSprite('office_map', './src/assets/office_map.png');
const mapData = await (await fetch("./src/mapdata/office_map.json")).json();

const spawnPoints = {};

export const createOfficeMap = () => {
    const layers = mapData.layers;
    const officeMap = k.add([k.sprite("office_map"), 
        k.pos(0), 
        k.scale(4)]); // magic freaking number that probably use for things to be sized properly

    // add spawn points 
    for (const layer of layers) {
        if (layer.name === 'spawn_points') {
            for ( const obj of layer.objects ) {
                spawnPoints[obj.name] = k.vec2(obj.x, obj.y)
            }
        }
    }


    // load the characters 

    const receptionist = officeMap.add([
        k.sprite('receptionist'),
        k.pos(spawnPoints['receptionist']), // absolutely magic number
        k.area(),
        k.anchor('center'),
        k.body({isStatic: true}),
        'receptionist'
    ])
    
}





console.log(spawnPoints);