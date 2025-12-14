import { k } from './kaboomCtx.js';
// import { createInteraction } from './interaction.js';
// import { seconds } from './utils.js';
import { createSpawnPoint } from './spawn_point.js';
import { showDialogue, showDialogueMultiple } from './utils.js';
import playerFaceSpriteUrl from './../assets/player_face.png';
import receptionistSpriteUrl from './../assets/receptionist.png';
import receptionistFaceSpriteUrl from './../assets/receptionist_face.png';
import shogunBossFaceSpriteUrl from './../assets/shogun_boss_face.png';
import shogunBossSpriteUrl from './../assets/shogun_boss.png';
import workerOneSpriteUrl from './../assets/worker_one.png';
import workerTwoSpriteUrl from './../assets/worker_two.png';
import catSpriteUrl from './../assets/cat.png';
import officeMapSpriteUrl from './../assets/office_map.png';
import officeMapUrl from './../mapdata/office_map.json';
// load the character sprites 

// player

k.loadSprite('player-face', playerFaceSpriteUrl)

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

// receptionist

k.loadSprite('receptionist', receptionistSpriteUrl, {
    sliceX: 4, 
    sliceY: 2,
    anims: {
        'down': 0,
        'up': 1,
        'right': 2,
        'left': 3,
        'dance': {from: 4, to: 7, loop: true, speed: 2 }
    }
});

k.loadSprite('receptionist-face', receptionistFaceSpriteUrl )

// shogun boss 

k.loadSprite('shogun_boss-face', shogunBossFaceSpriteUrl )

k.loadSprite('shogun_boss', shogunBossSpriteUrl, {
    sliceX: 4, 
    sliceY: 2,
    anims: {
        'down': 0,
        'up': 1,
        'right': 2,
        'left': 3,
        'surprised': 4,
        'jutsu': 7,
        'dance': {from: 5, to: 7, loop: true, speed: 2 }
    }
});

// worker one ( does nothing )

k.loadSprite('worker_one', workerOneSpriteUrl, {
    sliceX: 4, 
    sliceY: 2,
    anims: {
        'down': 0,
        'up': 1,
        'right': 2,
        'left': 3,
        'dance': {from: 5, to: 7, loop: true, speed: 2 }
    }
});

// worker two ( tweens - goes to grab coffee )

k.loadSprite('worker_two', workerTwoSpriteUrl, {
    sliceX: 4, 
    sliceY: 2,
    anims: {
        'down': 0,
        'up': 1,
        'right': 2,
        'left': 3,
        'dance': {from: 5, to: 7, loop: true, speed: 2 }
    }
});


// cat ( does nothing )

k.loadSprite('cat', catSpriteUrl, {
    sliceX: 12, 
    sliceY: 1,
    anims: {
        'idle': {from: 0, to: 11, loop: true, speed: 3 }
    }
})

// load the map
const mapSprite = k.loadSprite('office_map', officeMapSpriteUrl);

const loadMapData = async () => {
    return officeMapUrl;
}

export const spawnPoints = {};

export const createOfficeMap = async () => {
    const mapData = await loadMapData();
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

        if (layer.name === 'player_waypoints') {
            for ( const obj of layer.objects ) {
                officeMap.add([
                    k.pos(obj.x, obj.y),
                    obj.name
                ])
            }
        }

        if (layer.name === 'scrolls_tween_waypoints') {
            for ( const obj of layer.objects ) {
                officeMap.add([
                    k.pos(obj.x, obj.y),
                    obj.name,
                    k.anchor('center')
                ])
            }
        }


    }

    // Add the characters 

    const receptionist = officeMap.add([
        k.sprite('receptionist'),
        k.pos(spawnPoints['receptionist']), // absolutely magic number
        k.area(),
        k.anchor('center'),
        k.body({isStatic: true}),
        'receptionist'
    ])


    const shogunBoss = officeMap.add([
        k.sprite('shogun_boss'),
        k.pos(spawnPoints['shogun_boss']), 
        k.area(),
        k.scale(1.20),
        k.anchor('center'),
        k.body({isStatic: true}),
        'shogun_boss'
    ])

    shogunBoss.play('right');
    
    const workerOne = officeMap.add([
        k.sprite('worker_one'),
        k.pos(spawnPoints['worker_one']), 
        k.area(),
        k.scale(1.20),
        k.anchor('center'),
        k.body({isStatic: true}),
        'worker_one'
    ])

    workerOne.play('up');

    const workerTwo = officeMap.add([
        k.sprite('worker_two'),
        k.pos(spawnPoints['worker_two']), 
        k.area(),
        k.scale(1.20),
        k.anchor('center'),
        k.body({isStatic: true}),
        'worker_two'
    ])

    workerTwo.play('up');

    const cat = officeMap.add([
        k.sprite('cat'),
        k.pos(spawnPoints['cat']), 
        k.area(),
        k.scale(0.60),
        k.anchor('center'),
        k.body({isStatic: true}),
        'cat'
    ])

    cat.play('idle');

    // const player = officeMap.add([
    //     k.sprite('player'),
    //     k.pos(spawnPoints['player']), 
    //     k.area(),
    //     k.anchor('center'),
    //     k.timer(),
    //     'player'
    // ])


    return officeMap

}
