import { k } from './kaboomCtx.js';
// import { createInteraction } from './interaction.js';
// import { seconds } from './utils.js';
import { createSpawnPoint } from './spawn_point.js';

// load the character sprites 

// player

k.loadSprite('player-face', './src/assets/player_face.png')

k.loadSprite('player', './src/assets/player.png', {
    sliceX: 4,
    sliceY: 5,
    anims: {
        'idle-down': 0,
        'idle-up': 4,
        'idle-left': 8,
        'idle-right': 12,
        'attack-down': 16,
        'attack-up': 17,
        'attack-left': 18,
        'attack-right': 19,
        'down': {from: 0, to: 3, loop: true, speed: 8 },
        'up': {from: 4, to: 7, loop: true, speed: 8 },
        'left': {from: 8, to: 11, loop: true, speed: 8},
        'right': {from: 12, to: 15, loop: true, speed: 8}
    }
})


// load the map
k.loadSprite('temple_map', './src/assets/temple_map.png');
const mapData = await (await fetch("./src/mapdata/temple_map.json")).json();

export const createTempleMap = async () => {
    const layers = mapData.layers;
    const templeMap = k.add([k.sprite('temple_map'), 
        k.pos(0), 
        k.scale(4)]); // magic freaking number that probably use for things to be sized properly


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
    }

    return templeMap

}
