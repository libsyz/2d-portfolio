import { k } from './kaboomCtx.js';
import { createSparkleInteraction } from './interaction.js';
import { charDialogue, leftRightPatrol, seconds } from './utils.js';
import { createSpawnPoint } from './spawn_point.js';
import houseMapSpriteUrl from './../assets/house_map.png';
import houseMapUrl from './../mapdata/house_map.json';
import bigTreasureChestSpriteUrl from './../assets/big_treasure_chest.png';
import educationScrollSpriteUrl from './../assets/scroll_plant.png';
import christinSpriteUrl from './../assets/woman.png';
import christinFaceSpriteUrl from './../assets/christin_face.png';
import eliasSpriteUrl from './../assets/child.png';
import eliasFaceSpriteUrl from './../assets/elias_face.png';

// load the map
const mapSprite = k.loadSprite('house_map', houseMapSpriteUrl);



const loadMapData = async () => {
    const mapData = await (await fetch(houseMapUrl)).json();
    return mapData;
}

// load sparkle effect
k.loadSprite('sparkle', './src/assets/spark.png', {
    sliceX: 4,
    sliceY: 1,
    anims: {
        'gleam': { from: 0, to: 3, loop: true, speed: 8 }
    }
});


// load interactables
// treasure chest
k.loadSprite('treasure_chest', bigTreasureChestSpriteUrl, {
    sliceX: 2, 
    sliceY: 1,
    anims: {
        'closed': 0,
        'open': 1
    }
});


// education scroll
k.loadSprite('education_scroll', educationScrollSpriteUrl);


// christin

k.loadSprite('christin', christinSpriteUrl, {
    sliceX: 4,
    sliceY: 2,
    anims: {
        'idle': 1,
        'idle-left': 3, 
        'idle-right': 4,
        'vibe': {from: 4, to: 6, speed: 4}
    }
});

k.loadSprite('christin_face', christinFaceSpriteUrl);


// Elias

k.loadSprite('elias', eliasSpriteUrl, {
    sliceX: 2,
    sliceY: 4,
    anims: {
        'idle': 0,
        'walk-down': {from: 0, to: 1, loop: true, speed: 3},
        'walk-up':  {from: 2, to: 3, loop: true, speed: 3},
        'walk-left': {from: 4,to: 5, loop: true, speed: 3}, 
        'walk-right': {from: 6,to: 7, loop: true, speed: 3}, 
    }
});

k.loadSprite('elias_face', eliasFaceSpriteUrl);


// Patrol Component for Elias 



// instatiate the map
export const createHouseMap = async (gameState) => {
    const mapData = await loadMapData();
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
                createSparkleInteraction(houseMap, obj);
            }
        }

        if (layer.name === 'spawn_points') {
            for ( const obj of layer.objects ) {
                createSpawnPoint(houseMap, obj);
            }
        }



    }

    const educationChestBehavior = (game) => {
        return { 
            setup() {
                if (gameState.scrolls.includes('education')) {
                    this.play('open');
                }
            }
        }
    }

    // add interactables with animations
    const educationChest = houseMap.add([
        k.sprite('treasure_chest'),
        k.pos(k.vec2(447, 270)), // absolutely magic number - TODO: Add Spawn Point 
        k.area(),
        k.anchor('center'),
        k.body({isStatic: true}),
        educationChestBehavior(gameState),
        'education_treasure_chest'
    ])

    educationChest.setup();


    // Add Christin

    const christin = houseMap.add([
        k.sprite('christin'),
        k.pos(k.vec2(391, 493)), // absolutely magic number
        k.area(),
        k.scale(1),
        k.body({isStatic: true}),
        'christin',
        charDialogue()
    ])

    christin.getFaceTag = () => { return 'christin_face'; }
    christin.getVoice = () => { return 'default-voice'; }
    christin.getDialogueMessages = () => {
        return [
            'Are you looking for your\neducation scroll?', 
            'It has to be either on the\nliving room or in your room'
        ]
    }

    setInterval( () => {
        christin.play('vibe');
    }, 3000)


    // Add Elias


    // const leftRightPatrol = () => {
    //     return {
    //         id: 'switchPatrol', 
    //         tick() {
    //             if ( this.patrolState === 'idle') {
    //                 this.direction *= -1;
    //                 this.flipX = !this.flipX;
    //                 this.patrolState = 'move';
    //             } else {
    //                 this.patrolState = 'idle';
    //             }
    //         },
    //         patrol() {
    //             if (this.patrolState === 'idle') {
    //                 this.move( 10 * this.direction , 0 );
    //                 if (this.curAnim() !== 'walk-right') {
    //                     this.play('walk-right');
    //                 }
    //             } else {
    //                 this.play('idle');
    //             }
    //         } 
    //     }
    // }

    const elias = houseMap.add([
        k.sprite('elias'),
        k.pos(k.vec2(360, 421)), // absolutely magic number - TODO add spawn point
        k.area(),
        k.scale(0.70),
        k.body({isStatic: true}),
        {
            landmarkX: 360
        },
        leftRightPatrol(10, 20),
        charDialogue(),
        'elias'
    ])

    elias.getFaceTag = () => { return 'elias_face'; }
    elias.getVoice = () => { return 'default-voice'; }
    elias.getDialogueMessages = () => {
        return [
            'Papi Papi I cant wait to go\ndown to the beach!'
        ]
    }

    elias.patrol();
    
    elias.onCollide('player', () => {
        elias.cancelPatrol();
        elias.play('idle');
    })

    elias.onCollideEnd('player', () => {
        elias.patrol();
    })
    // elias patrol 
    // on cycles of two seconds
    // move elias right 
    // stop, be idle
    // move elias left
    // stop, be idle

    // setInterval(() => elias.tick(), 2000); // TODO - there has to be a better way than a setinterval

    // elias.onUpdate(() => {
    //     elias.patrol(); // TODO - Could I move this to the elias object itself? 
    // })

    // this patrol behavior really sucks I must say

    // Ideally it should be something like  -
    // Character gets spawned
    // Walks until it has reached a certain distance in X away from the spawnpoint 
    // Turns around, changes direction
    // Walks until it has reached the spawnpoint

    // When in contact with the player
    // Patrol behavior stops
    // Patrol behavior remembers direction and how far away from spawnpoint
    // 

    return houseMap;

}