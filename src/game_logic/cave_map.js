import { createBaddieGreenDemon } from './baddie_green_demon.js';
import { k } from './kaboomCtx.js';
import { createSpawnPoint } from './spawn_point.js';


const mapSprite = k.loadSprite('cave_map', './src/assets/cave_map.png');
const mapData = await (await fetch("./src/mapdata/cave_map.json")).json();

export const createCaveMap = async (gameState) => {
    const layers = mapData.layers;
    const caveMap = k.add([k.sprite("cave_map"), 
        k.pos(0), 
        k.scale(4)]
    ); // magic freaking number that probably use for things to be sized properly

    // add spawn points 
    for (const layer of layers) {
        if (layer.name === 'spawn_points') {
            for ( const obj of layer.objects ) {
                createSpawnPoint(caveMap, obj);
            }
        }

        if (layer.name === "bounds") {
            for (const boundary of layer.objects) {
                    caveMap.add([
                        k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                        }),
                        k.body({ isStatic: true }),
                        k.pos(boundary.x, boundary.y),
                        'boundary',
                    ]);
            }
        }
    }

    // what do I need here 

    // I need to set the treasure chest on a location
    // I need to keep count of the baddies

    caveMap.get('baddie_green_spawn').forEach((spawnPoint) => {
        const demon = createBaddieGreenDemon();
        demon.moveTo(spawnPoint.worldPos());
        gameState.addBaddieGreenDemon();
        
        demon.on('death', () => {
            // problem - need to guarantee demon only dies once
            if (demon.hp() === 0) {
                let pos = demon.worldPos();
                gameState.killBaddieGreenDemon();
                k.debug.log(gameState.baddieGreenDemonsInCave);
                if (gameState.areAllBaddieGreenDemonsDead()) {
                    k.debug.log('all gone');
                }
            }   
        })
    })

 




    const experienceChestSetup = (game) => {
        return { 
            setup() {
                if (game.scrolls.includes('experience')) {
                    this.play('open');
                }
            }
        }
    }

    const experienceChest = caveMap.add([
        k.sprite('treasure_chest'),
        k.pos(224, 64), // magic number, did not manage to apply moveTo() the treasure chest
        k.area(),
        k.anchor('center'),
        k.body({isStatic: true}),
        experienceChestSetup(gameState),
        'experience_treasure_chest'
    ])

    // k.debug.log(caveMap.get('treasure_chest_spawn')[0].pos);

    experienceChest.setup()

    return caveMap;
}