import { k } from './kaboomCtx.js';
import { createInteraction } from './interaction.js'
import { charDialogue } from './utils.js';


// load the map sprite
const mapSprite = k.loadSprite('map', './src/assets/map.png');
const mapData = await (await fetch("./src/mapdata/map.json")).json();


// load the animation sprites 

const waterRipple = k.loadSprite('water_ripple', './src/assets/water_ripple.png', {
    sliceX: 4,
    sliceY: 1,
    anims: { 
        'ripple': { from: 0, to: 3, loop: true, speed: 3 } 
    }
});


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
                        shape: new k.Rect(k.vec2(0,0), boundary.width, boundary.height),
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
                    k.rect(scene.width, scene.height),
                    k.area(),
                    k.pos(scene.x + 162, scene.y + 86),
                    k.anchor('center'),
                    scene.name,
                    k.opacity(0)
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

        if (layer.name === 'water_ripples') {
            for ( const obj of layer.objects ) {
                let waterRipple = map.add([
                    k.pos(obj.x, obj.y),
                    k.sprite('water_ripple'),
                    k.z(999),
                    'water_ripple'
                ])

                waterRipple.play('ripple');
            }
        }


    }

    const center = k.add([
        k.rect(20,20),
        k.outline(2),
        k.pos(0,0 ),
        k.anchor('center'),
        k.opacity(0),
        'center'
    ])

    center.moveTo(map.get('scene_1')[0].worldPos());

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