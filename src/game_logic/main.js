import { k } from "./kaboomCtx.js";
import { createPlayer, createOfficePlayer } from "./player.js";
import { createOfficeMap } from "./office_map.js";
import { createMap } from "./map.js";
import { createHouseMap } from "./house_map.js";
import { createTempleMap } from "./temple_map.js";
import { createCaveMap } from "./cave_map.js";
import { createInterviewer } from "./interviewer.js";
import { showDialogue, fadeInScene, showDialogueMultiple, showDialogueScrollAcquired, createScroll } from "./utils.js";
import { createBaddieGreenDemon } from "./baddie_green_demon.js";
import { createUI } from "./ui.js";
import { createGameState } from "./game_state.js";
import { createSkillsCutscene } from "./skills_cutscene.js";
import { createSoundManager } from "./sound.js";
import { characterShadow } from "./utils.js";

k.setBackground(255, 255, 255);

k.loadMusic('bgm-main', './src/audio/musics/main.mp3');
k.loadMusic('bgm-house', './src/audio/musics/house.mp3');
k.loadMusic('bgm-temple', './src/audio/musics/temple.mp3');
k.loadMusic('bgm-cave', './src/audio/musics/cave.mp3');
k.loadMusic('bgm-office', './src/audio/musics/office.mp3');
k.loadSound('default-voice', './src/audio/fx/default-voice.mp3');
k.loadSound('player-voice', './src/audio/fx/player-voice.mp3');

// import sprites that need to be loaded before anything else

k.loadSprite('dialogue_box_simple', './src/assets/dialogue_box_simple.png');
k.loadSprite('dialogue_info', './src/assets/dialogue_info.png', {
    sliceX: 4, 
    sliceY: 1,
    anims: {
        'show': {from: 0, to: 3, loop: true, speed: 5}
    }
})

k.loadSprite('intro_background', './src/assets/intro_background.png');
k.loadSprite('experience_scroll', './src/assets/scroll_thunder.png');
k.loadSprite('player_face', './src/assets/player_face.png');
k.loadSprite('character-shadow', './src/assets/character_shadow.png');

// load gamestate, available to all the scenes

const gameState = createGameState();

const gameEndSceneController = k.add([
    'gameEndSceneController'
])

gameEndSceneController.on('endgame', () => { 
    const dialog = showDialogueMultiple('player_face', [
        'I have found all my scrolls!',
        'Time to go back to the Shogun and talk smack to him!',
        'if you know what Im saying'
    ], 'player-voice')

    k.onKeyRelease('space', () => {
        k.trigger('play-dialogue', 'dialog-box');
    })

    dialog.onStateEnter('end', () => {
        k.go('end');
    })
})

const soundManager = createSoundManager(k);

k.scene("main", async (playerSpawnPoint, sceneName) => {
    const map = createMap(sceneName);
    const ui = createUI(gameState, soundManager);
    k.setLayers(['obj', 'shadow'], 'obj');

    soundManager.trigger('play-bgm', 'main');

    fadeInScene();

    const player = createPlayer();
    player.use(characterShadow());
    player.use(k.layer('obj'));
    player.get('character-shadow')[0].use(k.layer('shadow'));
    k.debug.log(player.layer);

    player.moveTo(map.get(playerSpawnPoint)[0].worldPos())

    const forestBaddieLocation = map.get('baddie_spawn')[0].worldPos();
    createBaddieGreenDemon(gameState, 'forest', forestBaddieLocation); 
    
    const center = k.get('center')[0]

    player.onUpdate(() => {
        k.camPos(center.worldPos());
    })

    
    const sceneNames = ['scene_1', 'scene_2', 'scene_3'];

    sceneNames.forEach(sceneName => { 

        k.onCollide('player', sceneName, (player, scene) => {
            gameState.currentScene = sceneName;
            k.tween(center.worldPos(), scene.worldPos(), 0.5, (newVal) => {
                center.pos = newVal, k.easings.linear;
            })
        })
    }) 
    

    k.onCollide('player', 'old_man', (player, oldMan) => {
        player.enterState('dialogue', oldMan);
    })

    k.onCollideEnd('player', 'old_man', (player, _) => {
        player.enterState('attack');
    })

    k.onCollide('player', 'chicken', (_, chicken) => {
        player.enterState('dialogue_chicken', chicken);
    })

    k.onCollideEnd('player', 'chicken', (_, chicken) => {
        player.enterState('attack'); 
    })

    k.onCollide('player', 'fisherman', (player, fisherman) => {
        player.enterState('dialogue', fisherman);
    })

    k.onCollideEnd('player', 'fisherman', (player, _) => {
        player.enterState('attack');
    })


    k.onCollide('player', 'mailbox', () => {
        showDialogue('player_face', 'You can reach me at miguel.leo.jimenez@gmail.com', gameState);
    })

    k.onCollideEnd('player', 'mailbox', () => {
        k.destroy(k.get('dialog')[0]);
    })

    k.onCollide('player', 'house_door', () => {
        k.go('house', 'player_spawn');
    })

    k.onCollide('player', 'temple_door', () => {
        k.go('temple', 'player_spawn');
    })

    k.onCollide('player', 'cave_door', () => {
        k.go('cave', 'player_spawn');
    })

});

k.scene('house', async (playerSpawnPoint) => { 
    const houseMap = createHouseMap(gameState);
    const ui = createUI(gameState, soundManager);
    k.setBackground(58, 58, 81);

    soundManager.trigger('play-bgm', 'house');
   
    // ui needs to read from the gamestate and update if necessary

    fadeInScene();

    const player = createPlayer();
    player.enterState('explore');
    player.moveTo(houseMap.get(playerSpawnPoint)[0].worldPos())

    player.onUpdate( () =>  {
            k.camPos(player.worldPos());
    })



    let treasureCollision = k.onCollide('education_treasure_chest', 'player', (treasureChest, player) => {
        let openChestEvent = k.onKeyRelease('space', async () => { 
        treasureChest.play('open');
        // spawn the scroll at the center of the chest
        const edScroll = k.add([
            k.sprite('education_scroll'),
            k.pos(treasureChest.worldPos()),
            k.scale(3),
            k.anchor('center'),
            k.z(999),
            'education_scroll',
        ]);

        player.fxPlay('scrollObtained');
        k.tween(
            edScroll.pos, 
            k.vec2(edScroll.pos.x, edScroll.pos.y - 20),
            1,
            (posVal) => { edScroll.pos = posVal }   
        )

        await openChestEvent.cancel();

        showDialogueScrollAcquired(
            gameState,
            'player_face', 
            [
                'I found my education scroll!', 
                'I suddenly know kung fu!'
            ],
            gameEndSceneController
        );

        ui.getScroll('education');
        
        })
        gameState.updateScrolls('education');
        
    })

    k.onCollideEnd('education_treasure_chest', 'player', () => {
        if (gameState.scrolls.includes('education') === true) { 
            k.get('dialog').forEach(el => k.destroy(el));
            k.get('education_scroll').forEach(el => k.destroy(el));
            treasureCollision.cancel();
        }
    })


    k.onCollide('player', 'christin', (player, christin) => {
        player.enterState('dialogue', christin);
    })

    k.onCollideEnd('player', 'christin', (player, _) => { 
        player.enterState('explore');
    })

    k.onCollide('player', 'elias', (player, elias) => {
        player.enterState('dialogue', elias);
}) 

    k.onCollideEnd('player', 'elias', (player, _) => { 
        player.enterState('explore');
    })

    k.onCollide('player', 'book_shelf', (player, bookShelf) => { 
        player.enterState('dialogue', bookShelf);
    })

    k.onCollideEnd('player', 'book_shelf', () => {
        player.enterState('explore');
    })

    k.onCollide('player', 'globe', (player, globe) => { 
        player.enterState('dialogue', globe);
    })

    k.onCollideEnd('player', 'globe', (player, _) => {
        player.enterState('explore');
    })

    k.onCollide('player', 'painting', (player, painting) => { 
        player.enterState('dialogue', painting);
    })

    k.onCollideEnd('player', 'painting', (player, _) => {
        player.enterState('explore');
    })

    k.onCollide('player', 'psychology_diploma', (player, diploma) => {
        player.enterState('dialogue', diploma);
    })

    k.onCollideEnd('player', 'psychology_diploma', (player, _) => { 
        player.enterState('explore');
    })

    k.onCollide('player', 'exit', () => {
        k.debug.log('exit');
        k.go('main', 'house_exit_spawn', 'scene_1');
    })

})

k.scene('temple', async (playerSpawnPoint) => { 
    const templeMap = await createTempleMap();
    const ui = createUI(gameState, soundManager);
    soundManager.trigger('play-bgm', 'temple');

    const player = createPlayer();
    player.canAttack = false;

    player.moveTo(templeMap.get(playerSpawnPoint)[0].worldPos())
    
    fadeInScene();

    const cutScene = await createSkillsCutscene(gameState);


    player.onCollide('dialogue_start', async () => {
        if (gameState.scrolls.includes('skills') === false ) {
            player.enterState('cutscene');
            cutScene.init(templeMap, player);
        } else {
            return
        }
     })

    player.onCollide('skills_scroll', () => {
        // stops dialogue from restarting if player hits dialogue_start point
        // again before obtaining the scroll
        const dialogueStartObj = templeMap.get('dialogue_start')[0];
        dialogueStartObj.destroy();
        gameState.updateScrolls('skills');
        ui.getScroll('skills');
        player.fxPlay('scrollObtained');
        const dialog = showDialogueScrollAcquired(
            gameState,
            'player_face', 
            [
                'I found my skills scroll', 
                'I suddenly know jiu jitsu!'
            ],
            gameEndSceneController
            );
        
        

        dialog.onStateEnter('end', () => {
            // hating this line of code but I need to keep moving forward
            // somehow I can't find the map, so I'm assuming the map 
            // is the first element that can be found, and then I am 
            // finding the scroll 
            k.get('temple_map')[0].get('skills_scroll')[0].destroy()
        });
    })


    k.onCollide('player', 'exit', () => {
        k.go('main', 'temple_exit_spawn', 'scene_2');
    })

 
})


k.scene('end', async () => { 
    const officeMap = await createOfficeMap();
    const player = await createOfficePlayer();
    soundManager.trigger('office', 'house');
    fadeInScene();
    // fourth is the way point that is in front of the Shogun
    player.moveTo(officeMap.get('fourth')[0].worldPos());

    let sceneCounter = 1; 
    k.wait(sceneCounter, () => {
        player.play('idle-right');
    })

    sceneCounter += 0.5

    k.wait(sceneCounter, () => { 
        const shogunDialog = showDialogueMultiple(
            'shogun_boss-face', 
            [
                'So you are now back', 
                'I hope you have something to show??'
            ],
            'default-voice'
        )

        k.trigger('play-dialogue', 'dialog-box');
        k.onKeyRelease('space', () => {
            k.trigger('play-dialogue', 'dialog-box');
        });

        shogunDialog.onStateEnter('end', () => {

            const scrolls = [
                { spriteName: 'yellowScrollUI', objectName: 'experience'}, 
                { spriteName: 'redScrollUI', objectName: 'knowledge' },
                { spriteName: 'greenScrollUI', objectName: 'skills' }
            ]

            scrolls.forEach(async (scroll) => {
                let scrollObj = await createScroll(scroll.spriteName, scroll.objectName, player.worldPos())
                let scrollWaypoint = await officeMap.get(`${scroll.objectName}_waypoint`)[0].worldPos();

                k.tween(scrollObj.pos, scrollWaypoint, 1, newPos => scrollObj.pos = newPos, k.easings.linear )
            })

            k.wait(2, () => {
                showDialogueMultiple(
                    'shogun_boss-face', 
                    [
                        'Wow, your credentials look very impressive', 
                        'Welcome to Shogun and Co!'
                    ],
                    'default-voice'
                );

                k.trigger('play-dialogue', 'dialog-box');
                k.onKeyRelease('space', () => {
                    k.trigger('play-dialogue', 'dialog-box');
                });
            })
        })
    })

    
    
})


k.scene('intro', () => {
    k.setBackground(155, 155, 155);
    const bgImage = k.add([
        k.pos(0),
        k.sprite('intro_background'),
    k.scale(0.75)
    ])

    const startGame = k.add([
        k.pos(10, 240),
        k.text("Start Game", {
            size: 20, 
            width: 500, 
            align: 'center'
        }),
        k.color(248, 169, 69),
        'title', {
            isSelected: true
        }
    ])

    const downloadResume = k.add([
        k.pos(10, 270),
        k.text("See Resume", {
            size: 20, 
            width: 500, 
            align: 'center'
        }),
        k.color(248, 169, 69),
        'title', {
            isSelected: false
        }
    ])

    const makeSelector = (titleObj) => { 
        titleObj.add([
            k.pos(140, -5),
            k.sprite('shuriken2'),
            k.scale(1.5)
        ])
    }

    makeSelector(startGame);

    k.onKeyPress('space', () => {
        if(startGame.isSelected) {
            k.go('office');
        } else {
            k.debug.log('should open CV');
            // window.location.assign('https://www.notion.so/mjimenez/Hi-Company-I-m-Miguel-662256cee933457ba77c21fd9fdb4fee?pvs=4');
        }
    })

    k.onKeyPress('down', () => {
        if (startGame.isSelected) {
            startGame.isSelected = false;
            downloadResume.isSelected = true;
            k.destroy(startGame.children[0]);
            makeSelector(downloadResume);
        }
    })

    k.onKeyDown('up', () => {
        if (downloadResume.isSelected) {
            startGame.isSelected = true;
            downloadResume.isSelected = false;
            k.destroy(downloadResume.children[0]);
            makeSelector(startGame);
        }
    })
})

k.scene('office', async () => { 
    const officeMap = await createOfficeMap();
    soundManager.trigger('play-bgm', 'office');

    const player = await createOfficePlayer();
    player.moveTo(officeMap.get('player_spawn')[0].worldPos());
    fadeInScene();

    k.wait(2, () => {
        player.opacity = 1;
        player.enterState('start');
    })
    

    player.onStateEnter('start', () => {

        player.play('right');
        k.tween(player.pos, officeMap.get('first')[0].worldPos(), 1, newPos => player.pos = newPos, k.easings.linear )
        k.wait(1, () => player.enterState('first'))
    })

    player.onStateEnter('first', () => {
        player.play('idle-down');
        let dialogBox = showDialogueMultiple(
        gameState,    
        'player-face', 
        [
          'So nervous for my interview today', 
          'Hope everything goes well!'
        ])

        dialogBox.onStateEnter('end', () => player.enterState('second'))
    })

    player.onStateEnter('second', () => {
        player.play('up');
        k.tween(player.pos, officeMap.get('second')[0].worldPos(), 1, newPos => player.pos = newPos, k.easings.linear )
        k.wait(1, () => player.enterState('third'));
    })

    player.onStateEnter('third', () => {
        player.play('idle-up');
        let dialogBox = showDialogueMultiple(
            gameState,
            'receptionist-face', 
            [
             'Welcome to NinjaCorp! You must be Miguel',
             'Mr Shogun is ready for your interview'
            ])
        
        dialogBox.onStateEnter('end', () => player.enterState('fourth'))
    })

    player.onStateEnter('fourth', () => {
        player.play('right');
        k.tween(player.pos, officeMap.get('fourth')[0].worldPos(), 2, newPos => player.pos = newPos, k.easings.linear )
        k.wait(2, () => player.enterState('fifth'))
    })

    player.onStateEnter('fifth', () => {
        player.play('idle-right');
        
        let dialogBox = showDialogueMultiple(
            gameState,
            'shogun_boss-face', 
            [
             'Mr Miguel! Lets get started with your interview',
             'We will go over your scrolls of education, skills and experience',
             'you did not bring them?? what a joke!',
             'Go back to your village and dont come back until you have them!'
            ])

        dialogBox.onStateEnter('end', () => {
            k.wait(1, () => k.go('main', 'player_spawn'));
        })

    })

})

k.scene('cave', async (playerSpawnPoint) => {

    const caveMap = await createCaveMap(gameState);
    const ui = createUI(gameState, soundManager);
    soundManager.trigger('play-bgm', 'cave');
    k.setBackground(20, 27, 27);

    const player = createPlayer();

    player.moveTo(caveMap.get(playerSpawnPoint)[0].worldPos());

    player.onUpdate( () =>  {
        k.camPos(player.worldPos());
    });
    
    fadeInScene();


    k.onCollide('player', 'experience_treasure_chest', (player, experienceChest) => {
        player.clearAttackEvents();
        if (!gameState.playerHasKey) {
            player.enterState('dialogue', experienceChest);
        } else {
            const openChestEvent = k.onKeyRelease('space', () => {
                player.clearMovementEvents();
                player.goIdle();
                experienceChest.play('open');
                // spawn the scroll at the center of the chest
                const experienceScroll = k.add([
                    k.sprite('experience_scroll'),
                    k.pos(experienceChest.worldPos()),
                    k.scale(3),
                    k.anchor('center'),
                    k.z(999),
                    'experience_scroll',
                ]);

                
                player.fxPlay('scrollObtained');
                k.tween(
                    experienceScroll.pos, 
                    k.vec2(experienceScroll.pos.x, experienceScroll.pos.y - 20),
                    1,
                    (posVal) => { experienceScroll.pos = posVal }   
                )

                ui.getScroll('experience');
                gameState.updateScrolls('experience');
                openChestEvent.cancel();
                const dialogueBox = player.playerShowDialogue('player_face', ['I found my experience scroll!', 'I suddenly know jiu jitsu!'], 'player-voice');

                dialogueBox.onStateEnter('end', () => { 
                    if ( gameState.checkFinished() ) {
                        gameEndSceneController.trigger('endgame');
                    }
                }) 
            })
        }
    })


    k.onCollideEnd('experience_treasure_chest', 'player', () => {
            k.get('dialog-box').forEach(el => k.destroy(el));
            k.get('experience_scroll').forEach(el => k.destroy(el));
            player.enterState('attack');
    })

    player.onCollide('exit', () => {
        k.go('main', 'cave_exit_spawn', 'scene_3');
    })
    
})

k.go('main', 'player_spawn');
