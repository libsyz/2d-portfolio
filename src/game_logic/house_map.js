import { k } from './kaboomCtx.js';
import { createInteraction } from './interaction.js'

// load the map
const mapSprite = k.loadSprite('house_map', './src/assets/house_map.png');
const mapData = await (await fetch("./src/mapdata/house_map.json")).json();



// load interactables
// treasure ches
k.loadSprite('treasure_chest', './src/assets/big_treasure_chest.png', {
    sliceX: 2, 
    sliceY: 1,
    anims: {
        'closed': 0,
        'open': 1
    }
});

// education scroll
k.loadSprite('education_scroll', '../src/assets/scroll_plant.png');


// christin
k.loadSprite('christin', '../src/assets/woman.png', {
    sliceX: 4,
    sliceY: 2,
    anims: {
        'idle': 1,
        'idle-left': 3, 
        'idle-right': 4,
        'vibe': {from: 5, to: 8, speed: 2}
    }
});



// instatiate the map
export const createHouseMap = () => {
    const layers = mapData.layers;
    const houseMap = k.add([k.sprite("house_map"), 
        k.pos(0), 
        k.scale(4)]);

    // add boundaries 
    for (const layer of layers) {
        if (layer.name === "bounds") {
            for (const boundary of layer.objects) {
                    houseMap.add([
                        k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                        }),
                        k.body({ isStatic: true }),
                        k.pos(boundary.x, boundary.y),
                        'boundary',
                    ]);
            }
        }


        if (layer.name === 'interaction') {

            for ( const obj of layer.objects ) {
                // I would have to create the interactable based on the name 
                // look for 
                createInteraction(houseMap, obj);
            }
            
        }

    }

    // add interactables with animations
    const skillsChest = houseMap.add([
        k.sprite('treasure_chest'),
        k.pos(k.vec2(447, 270)), // absolutely magic number
        k.area(),
        k.anchor('center'),
        k.body({isStatic: true}),
        'education_treasure_chest'
    ])

    const christin = houseMap.add([
        k.sprite('christin'),
        k.pos(k.vec2(447, 1000)), // absolutely magic number
        k.area(),
        k.anchor('center'),
        k.body({isStatic: true}),
        'christin',
        k.z(999)
    ])



}