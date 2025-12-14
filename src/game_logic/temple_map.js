import { k } from './kaboomCtx.js';
// import { createInteraction } from './interaction.js';
// import { seconds } from './utils.js';
import { createSpawnPoint } from './spawn_point.js';
import templeMapSpriteUrl from './../assets/temple_map.png';
import templeMapUrl from './../mapdata/temple_map.json';
import skillsScrollSpriteUrl from './../assets/scroll_fire.png';
import spiritFaceSpriteUrl from './../assets/spirit_face.png';
import spiritSpriteUrl from './../assets/spirit.png';
// load the character sprites 

// spirit
k.loadSprite('spirit-face', spiritFaceSpriteUrl);

k.loadSprite('spirit',  spiritSpriteUrl, {
    sliceX: 5,
    sliceY: 1,
    anims: {
        'idle': { from: 0, to: 4, loop: true, speed: 10 } 
    }
});

// k.loadSprite('player', './src/assets/player.png', {
//     sliceX: 4,
//     sliceY: 5,
//     anims: {
//         'idle-down': 0,
//         'idle-up': 4,
//         'idle-left': 8,
//         'idle-right': 12,
//         'attack-down': 16,
//         'attack-up': 17,
//         'attack-left': 18,
//         'attack-right': 19,
//         'down': {from: 0, to: 3, loop: true, speed: 8 },
//         'up': {from: 4, to: 7, loop: true, speed: 8 },
//         'left': {from: 8, to: 11, loop: true, speed: 8},
//         'right': {from: 12, to: 15, loop: true, speed: 8}
//     }
// })


// load interactables 

k.loadSprite('skills_scroll', skillsScrollSpriteUrl);

// load the map


k.loadSprite('temple_map', templeMapSpriteUrl);

const loadMapData = async () => {
    const mapData = await (await fetch(templeMapUrl)).json();
    return mapData;
}


export const createTempleMap = async () => {
    const mapData = await loadMapData();
    const layers = mapData.layers;
    const templeMap = k.add([k.sprite('temple_map'), 
        k.pos(0), 
        k.scale(4), // magic number that I use for things to be sized properly
        'temple_map'
    ]); 


    // add spawn points 
    for (const layer of layers) {
        if (layer.name === 'spawn_points') {
            for ( const obj of layer.objects ) {
                templeMap.add([
                    k.pos(obj.x, obj.y),
                    k.area({
                        shape: new k.Rect(k.vec2(0), obj.width, obj.height)
                    }),
                    obj.name
                ])
            }
        }

        if (layer.name === "bounds") {
            for (const boundary of layer.objects) {
                templeMap.add([
                    k.area({
                    shape: new k.Rect(k.vec2(0,0), boundary.width, boundary.height),
                    }),
                    k.body({ isStatic: true }),
                    k.pos(boundary.x, boundary.y),
                    'boundary',
                ]);
            }
        }

        if (layer.name === 'interaction') {
            for ( const obj of layer.objects ) {
                templeMap.add([
                    k.pos(obj.x, obj.y),
                    k.rect(obj.width, obj.height),
                    k.opacity(0),
                    k.area(),
                    obj.name
                ])
            }
        }
    }


    return templeMap

}
