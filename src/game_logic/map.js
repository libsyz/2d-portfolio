import { k } from './kaboomCtx.js';
import { createInteraction } from './interaction.js'
import { charDialogue } from './utils.js';


// load the sprite
const mapSprite = k.loadSprite('map', './src/assets/map.png');
const mapData = await (await fetch("./src/mapdata/map.json")).json();

// load the character sprites

k.loadSprite('old_man_face', './src/assets/old_man_face.png');

k.loadSprite('old_man_idle', './src/assets/old_man_idle.png', {
    sliceX: 4,
    sliceY: 1,
    anims: {
        'idle': 0
    }
})




// instatiate the map
export const createMap = () => {
    const layers = mapData.layers;
    const map = k.add([k.sprite("map"), 
        k.pos(0), 
        k.scale(4)]);

    // add boundaries 
    for (const layer of layers) {
        if (layer.name === "bounds") {
            for (const boundary of layer.objects) {
                    map.add([
                        k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                        }),
                        k.body({ isStatic: true }),
                        k.pos(boundary.x, boundary.y),
                        'boundary',
                    ]);
            }
        }

        if (layer.name === 'scene') {
            for (const scene of layer.objects) { 
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), scene.width, scene.height)
                    }),
                    k.pos(scene.x, scene.y),
                    scene.name
                ])
            }
        }

        if (layer.name === 'interaction') {

            for ( const obj of layer.objects ) {
                // I would have to create the interactable based on the name 
                // look for 
                createInteraction(map, obj);
            }
            
        }

        if (layer.name === 'spawn_points') {
            for ( const obj of layer.objects ) {

                map.add([
                    k.pos(obj.x, obj.y),
                    k.area({
                        shape: new k.Rect(k.vec2(0), obj.width, obj.height)
                    }),
                    obj.name
                ])
            }
        }

    }

    

    const oldMan = map.add([
        k.sprite('old_man_idle'), 
        k.pos(map.get('old_man_spawn')[0].pos),
        {anim: 'idle'},
        k.area(),
        k.scale(1),
        k.body({isStatic: true}),
        'old_man_idle',
        charDialogue()
    ]);




    return map;
}