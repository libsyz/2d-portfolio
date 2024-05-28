import { k } from './kaboomCtx.js';
import { createInteraction } from './interaction.js';
import { seconds } from './utils.js';
import { createSpawnPoint } from './spawn_point.js';

// load the map
const mapSprite = k.loadSprite('house_map', './src/assets/house_map.png');
const mapData = await (await fetch("./src/mapdata/house_map.json")).json();



// load interactables
// treasure chest
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
        'vibe': {from: 4, to: 6, speed: 4}
    }
});

k.loadSprite('christin_face', '../src/assets/christin_face.png');


// Elias

k.loadSprite('elias', '../src/assets/child.png', {
    sliceX: 2,
    sliceY: 4,
    anims: {
        'idle': 0,
        'walk-down': {from: 1, to: 2, loop: true, speed: 3},
        'walk-up':  {from: 3, to: 4, loop: true, speed: 3},
        'walk-left': {from: 5,to: 6, loop: true, speed: 3}, 
        'walk-right': {from: 6,to: 7, loop: true, speed: 3}, 
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
                createInteraction(houseMap, obj);
            }
        }

        if (layer.name === 'spawn') {
            debugger
            for ( const obj of layer.objects ) {
                createSpawnPoint(houseMap, obj);
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

    // Add Christin

    const christin = houseMap.add([
        k.sprite('christin'),
        k.pos(k.vec2(391, 493)), // absolutely magic number
        k.area(),
        k.anchor('center'),
        k.body({isStatic: true}),
        'christin'
    ])

    setInterval( () => {
        christin.play('vibe');
    }, 3000)


    // Add Elias

    const leftRightPatrol = () => {
        return {
            id: 'switchPatrol', 
            tick() {
                if ( this.patrolState === 'idle') {
                    this.direction *= -1;
                    this.flipX = !this.flipX;
                    this.patrolState = 'move';
                } else {
                    this.patrolState = 'idle';
                }
            },
            patrol() {
                if (this.patrolState === 'idle') {
                    this.move( 10 * this.direction , 0 );
                    if (this.curAnim() !== 'walk-right') {
                        this.play('walk-right');
                    }
                } else {
                    this.play('idle');
                }
            } 
        }
    }

    const elias = houseMap.add([
        k.sprite('elias'),
        k.pos(k.vec2(360, 421)), // absolutely magic number
        k.area(),
        k.scale(0.70),
        k.anchor('center'),
        k.body({isStatic: true}),
        leftRightPatrol(),
        'elias',
        { 
            patrolState: 'idle',
            direction: 1,
        }
    ])
    
    // elias patrol 
    // on cycles of two seconds
    // move elias right 
    // stop, be idle
    // move elias left
    // stop, be idle

    setInterval(() => elias.tick(), 2000);

    elias.onUpdate(() => {
        elias.patrol();
    })

}