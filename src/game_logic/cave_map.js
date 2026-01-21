import { createBaddieGreenDemon } from './baddie_green_demon.js';
import { k } from './kaboomCtx.js';
import { createSpawnPoint } from './spawn_point.js';
import caveMapSpriteUrl from './../assets/cave_map.png';
import caveMapUrl from './../mapdata/cave_map.json';


const mapSprite = k.loadSprite('cave_map', caveMapSpriteUrl);


const loadMapData = async () => {
    const mapData = caveMapUrl;
    return mapData;
}


export const createCaveMap = async (gameState) => {
    const mapData = await loadMapData();
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

        if (layer.name === 'interaction') {
            for ( const obj of layer.objects ) {
                caveMap.add([
                    k.pos(obj.x, obj.y),
                    k.rect(obj.width, obj.height),
                    k.opacity(0),
                    k.area(),
                    obj.name
                ])
            }
        }
    }

    const baddieGreenSpawnPoints = caveMap.get('baddie_green_spawn')
    baddieGreenSpawnPoints.forEach((spawnPoint) => {
        const demon = createBaddieGreenDemon(gameState, 'cave', spawnPoint.worldPos());
        // this guard prevents number of demons in gameState from ever being more
        // than the number of baddie waypoints  
        if ( gameState.baddieGreenDemonsInCave < baddieGreenSpawnPoints.length ) {
            gameState.addBaddieGreenDemon();
        }
    });

    const experienceChestSetup = (game) => {
        return { 
            setup() {
                if(gameState.scrolls.includes('experience')) {
                    this.play('open');
                    return;
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


    experienceChest.getFaceTag = () =>  { return 'player_face'; }
    experienceChest.getVoice = () => { return 'player-voice'; }
    experienceChest.getDialogueMessages = () => {
        return [
            'Seems like I need a key to open this...'
        ]
    } 


    experienceChest.setup()

    return caveMap;
}