import { k } from "./kaboomCtx.js";
import { createPlayer, createOfficePlayer } from "./player.js";
import { createOfficeMap } from "./office_map.js";
import { createMap } from "./map.js";
import { createHouseMap } from "./house_map.js";
import { createTempleMap } from "./temple_map.js";
import { createCaveMap } from "./cave_map.js";
import { showDialogue, fadeInScene, showDialogueMultiple, showDialogueScrollAcquired, createScroll } from "./utils.js";
import { createBaddieGreenDemon } from "./baddie_green_demon.js";
import { createUI } from "./ui.js";
import { createGameState } from "./game_state.js";
import { createSkillsCutscene } from "./skills_cutscene.js";
import { createSoundManager } from "./sound.js";
import { addMenuPlayer } from "./player.js";
import { createClient } from '@supabase/supabase-js'
import { trackGameStage } from "./analytics.js";

k.setBackground(255, 255, 255);


// Load fonts

import pixelScriptFontUrl from "/src/fonts/pixel-script.ttf";
import maruMinyaFontUrl from "/src/fonts/maru-minya.ttf";
import pixelifySansUrl from "/src/fonts/pixelify-sans.ttf";
import micro5FontUrl from "/src/fonts/micro-5-regular.ttf";

k.loadFont("pixel-script", pixelScriptFontUrl);
k.loadFont("maru-minya", maruMinyaFontUrl);
k.loadFont("pixelify-sans", pixelifySansUrl);
k.loadFont("micro-5", micro5FontUrl);


// Load music
import mainMusicUrl from './..//audio/musics/main.mp3'
import houseMusicUrl from './../audio/musics/house.mp3'
import templeMusicUrl from './../audio/musics/temple.mp3'
import caveMusicUrl from './../audio/musics/cave.mp3'
import officeMusicUrl from './../audio/musics/office.mp3'
import defaultVoiceUrl from './../audio/fx/default-voice.mp3'
import playerVoiceUrl from './../audio/fx/player-voice.mp3'

k.loadMusic('bgm-main', mainMusicUrl);
k.loadMusic('bgm-house', houseMusicUrl);
k.loadMusic('bgm-temple', templeMusicUrl);
k.loadMusic('bgm-cave', caveMusicUrl);
k.loadMusic('bgm-office', officeMusicUrl);
k.loadSound('default-voice', defaultVoiceUrl);
k.loadSound('player-voice', playerVoiceUrl);

// import sprites that need to be loaded before anything else


import dialogueBoxUrl from './../assets/dialogue_box_simple.png'
import dialogueInfoUrl from  './../assets/dialogue_info.png'


k.loadSprite('dialogue_box_simple', dialogueBoxUrl);
k.loadSprite('dialogue_info', dialogueInfoUrl, {
    sliceX: 4, 
    sliceY: 1,
    anims: {
        'show': {from: 0, to: 3, loop: true, speed: 5}
    }
})


import introBackgroundUrl from './../assets/intro_background.png'
import experienceScrollUrl from './../assets/scroll_thunder.png'
import playerFaceUrl from './../assets/player_face.png'
import characterShadowUrl from './../assets/character_shadow.png'
import menuParchmentUrl from './../assets/parchment.png'

k.loadSprite('intro_background', introBackgroundUrl);
k.loadSprite('experience_scroll', experienceScrollUrl);
k.loadSprite('player_face', playerFaceUrl);
k.loadSprite('character-shadow', characterShadowUrl);
k.loadSprite('menu-parchment', menuParchmentUrl);

// import supabase client for analytics


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const resumeUrl = "https://miguel-jimenez.super.site/"

const supabase = createClient(supabaseUrl, supabaseKey)


// load gamestate, available to all the scenes

const gameState = createGameState();

const gameEndSceneController = k.add([
    'gameEndSceneController'
])

gameEndSceneController.on('endgame', () => { 
    const player = k.get('player')[0];
    player.clearMovementEvents();
    player.clearAttackEvents();
    const dialog = showDialogueMultiple('player_face', [
        'I have found all my scrolls!',
        'It\'s time to return to Shogun\nCorp',
    ], 'player-voice')

    k.onKeyRelease('space', () => {
        k.trigger('play-dialogue', 'dialog-box');
    })

    dialog.onStateEnter('end', () => {
        k.go('end');
    })
})

const soundManager = createSoundManager(k);

k.scene('intro', async () => {

    const SCREEN_HEIGHT = 704;
    const SCREEN_WIDTH = 1280;

    trackGameStage('intro')

    k.setBackground(12, 12, 12);
    fadeInScene();

    const menuOptionsComp = () => {
        const selectedColor = new k.Color(255, 255, 255);
        const unselectedColor = new k.Color(248, 169, 69);

        return {
            add() { 
                this.onStateEnter('selected', () => {
                    this.color = selectedColor;
                    k.play('dialog-select');
                    addMenuPlayer(this, -150, -10);
                }) 
                this.onStateEnter('unselected', () => {
                    this.color = unselectedColor;
                    if (this.children.length > 0 ) {
                        this.children.forEach(el => el.destroy());
                    }
                })
            }
        }
    }

    const menuTitleContainer = k.add([
        k.anchor('center'),
        k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 100),
        k.color(50, 169, 69),
        k.opacity(0),
        k.rect(10, 10),
    ])
    
    const parchment = menuTitleContainer.add([
        k.sprite('menu-parchment'),
        k.anchor('center'),
        k.pos(0, -50),
        k.opacity(1)
    ])

    const scrollText = menuTitleContainer.add([
        k.text("私を雇ってもらう", {
            size: 40,
            width: 480,
            align: 'center',
            font: "maru-minya",
        }),
        k.anchor('center'),
        k.pos(0, -50),
        k.color(5, 5, 5),
        k.opacity(1)
    ])

    const title = menuTitleContainer.add([
        k.text("THE LOST NINJA SCROLLS",
            {
            size: 48, // 48 pixels tall
            width: 600,
            align: 'center', // it'll wrap to next line when width exceeds this value
            font: "pixelify-sans", // specify any font you loaded or browser built-in
            }
        ),
        k.anchor('center'),
        k.pos(0, 20),
        k.color(20, 155, 96)
    ])

    
    const subtitle = menuTitleContainer.add([
        k.anchor('center'),
        k.text("An interactive CV adventure",
            {
            size: 32,
            width: 480, // it'll wrap to next line when width exceeds this value
            font: "pixel-script",
            align: 'center' // specify any font you loaded or browser built-in
            }
        ),
        k.anchor('center'),
        k.color(200, 200, 200),
        k.pos(0, 70)
    ])


    const credits = menuTitleContainer.add([
        k.anchor('center'),
        k.text("2025 © BY MIGUEL JIMENEZ",
            {
            size: 20,
            width: 480, // it'll wrap to next line when width exceeds this value
            font: "micro-5",
            align: 'center' // specify any font you loaded or browser built-in
            }
        ),
        k.color(200, 200, 200),
        k.pos(0, 400)
    ])


    const menuOptionsContainer = k.add([
        k.rect(10, 10),
        k.anchor('center'),
        k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 3 * 2),
        k.color(60, 169, 69),
        k.opacity(0),
        'menu-options-container'
    ])

    const startGame = menuOptionsContainer.add([
        k.text("Start Game", {
            size: 30, 
            width: 200, 
            align: 'left',
            font: "pixelify-sans"
        }),
        k.color(248, 169, 69),
        'menu-option', 
        k.pos(0, 0),
        k.anchor('center'),
        k.state('selected', ['selected', 'unselected']),
        menuOptionsComp(),
    ])



    const downloadResume = menuOptionsContainer.add([
        k.text("See Resume", {
            size: 30, 
            width: 200, 
            align: 'left',
            font: "pixelify-sans"
        }),
        k.color(248, 169, 69),
        'menu-option', 
        k.pos(0, 60),
        k.anchor('center'),
        k.state('unselected', ['selected', 'unselected']),
        menuOptionsComp(),
    ])


    k.onKeyPress('space', () => {
        if(startGame.state === 'selected') {
            k.wait(1, () => {
                k.go('office');
            });
        } else {
            k.wait(1, () => {
                window.location.assign(resumeUrl);
            });
        }
    })

    // this is a mess let's create state controllers
    k.onKeyPress('down', () => {
        if (startGame.state === 'selected') {
            startGame.enterState('unselected');
            downloadResume.enterState('selected');
        }
    })

    k.onKeyDown('up', () => {
        if (downloadResume.state === 'selected') {
            downloadResume.enterState('unselected');
            startGame.enterState('selected');
        }   
    })


})

k.scene("main", async (playerSpawnPoint, sceneName) => {

    const map = await createMap(sceneName);
    const ui = createUI(gameState, soundManager);
    trackGameStage('main');

    soundManager.trigger('play-bgm', 'main');

    fadeInScene();

    const player = createPlayer(
        {
            shadow: {   
                renderShadow: true,
                xOffSet: -6,
                yOffSet: 3,
                scale: 1
            }
        }
    );

    player.moveTo(map.get(playerSpawnPoint)[0].worldPos())

    const forestBaddieLocation = map.get('baddie_spawn')[0].worldPos();

    const baddieGreenDemonShadow = {
        renderShadow: true,
        xOffSet: -6,
        yOffSet: 3,
        scale: 1
    }

    createBaddieGreenDemon(gameState, 'forest', forestBaddieLocation, baddieGreenDemonShadow); 
    
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
    trackGameStage('house')
    const houseMap = await createHouseMap(gameState);
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

        player.dance();

        await openChestEvent.cancel();

        const dialogue = await player.playerShowDialogue(
            'player_face', 
            [
                'I found my education scroll!\nIt reveals how I learned to\nthink.', 
                'Psychology and Organizational\nDevelopment taught me how people\nand systems behave',
                'Training in software\ndevelopment and AI showed me\nhow ideas can come to life.'
            ],
            'player-voice'
        );

        ui.getScroll('education');
        gameState.updateScrolls('education');
        k.trigger('play-dialogue', 'dialog-box');

        dialogue.onStateEnter('end', () => {
            player.play('idle-down');
            if ( gameState.checkFinished()) {
                gameEndSceneController.trigger('endgame');
                }
            })
        })
        
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
        k.go('main', 'house_exit_spawn', 'scene_1');
    })

})

k.scene('temple', async (playerSpawnPoint) => { 
    trackGameStage('temple');
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

        player.clearMovementEvents();
        gameState.updateScrolls('skills');
        ui.getScroll('skills');
        player.fxPlay('scrollObtained');
        const dialogueBox = player.playerShowDialogue('player_face', 
                [
                    'Here is my skills scroll! I use these to build and solve\nproblems.', 
                    'I know how to apply AI and\nautomation to real-world\nchallenges,',
                    'Technical product management to turn vision into delivery...',
                    'and use psychology to drive\nbehavior change'
                ], 'player-voice')

        k.trigger('play-dialogue', 'dialog-box');
        player.dance();

        dialogueBox.onStateEnter('end', () => {
            // hating this line of code but I need to keep moving forward
            // somehow I can't find the map, so I'm assuming the map 
            // is the first element that can be found, and then I am 
            // finding the scroll 
            player.setPlayerMovementEvents();
            k.get('temple_map')[0].get('skills_scroll')[0].destroy()
            player.play('idle-down');
            if ( gameState.checkFinished() ) {
                gameEndSceneController.trigger('endgame')
            }
        });
    })


    k.onCollide('player', 'exit', () => {
        k.go('main', 'temple_exit_spawn', 'scene_2');
    })

 
})


k.scene('end', async () => { 
    trackGameStage('end')
    const officeMap = await createOfficeMap();
    const player = await createOfficePlayer();

    const shogunBoss = officeMap.get('shogun_boss')[0];
    const receptionist = officeMap.get('receptionist')[0];
    const workerOne = officeMap.get('worker_one')[0];
    const workerTwo = officeMap.get('worker_two')[0];


    soundManager.trigger('play-bgm', 'office');
    fadeInScene();
    // fourth is the way point that is in front of the Shogun
    player.moveTo(officeMap.get('fourth')[0].worldPos());

    let sceneCounter = 1; 
    k.wait(sceneCounter, () => {
        player.play('idle-right');
    })

    sceneCounter += 0.5

    k.wait(sceneCounter, () => { 
        let shogunDialog = showDialogueMultiple(
            'shogun_boss-face', 
            [
                'So you have returned', 
                'The journey changes a person.\nLet’s see what it gave you'
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

            player.play('jutsu');

            scrolls.forEach(async (scroll) => {
                let scrollObj = await createScroll(scroll.spriteName, scroll.objectName, player.worldPos())
                let scrollWaypoint = await officeMap.get(`${scroll.objectName}_waypoint`)[0].worldPos();

                k.tween(scrollObj.pos, scrollWaypoint, 1, newPos => scrollObj.pos = newPos, k.easings.linear )
            })

            k.wait(2, () => {
                player.play('idle-right');

                shogunBoss.play('surprised');

                shogunDialog = showDialogueMultiple(
                    'shogun_boss-face', 
                    [
                        'These scrolls tell a rare\nstory. Impressive', 
                        'Welcome to Shogun Corp!'
                    ],
                    'default-voice'
                );

                k.trigger('play-dialogue', 'dialog-box');
                k.onKeyRelease('space', () => {
                    k.trigger('play-dialogue', 'dialog-box');
                });

                shogunDialog.onStateEnter('end', () => {
                    shogunBoss.play('dance');
                    player.play('dance');
                    receptionist.play('dance'); 
                    workerOne.play('dance');
                    workerTwo.play('dance');
                    k.wait(5, () => {
                        k.go('thank-you');
                    })
                })

            })
        })
    })

    
    
})


k.scene('office', async () => { 
    trackGameStage('office')
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
        'player-face', 
        [
          'So nervous for my interview\ntoday', 
          'Hope everything goes well!'
        ], 
        'player-voice')

        dialogBox.onStateEnter('end', () => player.enterState('second'))

        dialogBox.trigger('play-dialogue', 'dialog-box');
        k.wait(2, () => {
            dialogBox.trigger('play-dialogue', 'dialog-box');
        })
        k.wait(3,() => { dialogBox.trigger('play-dialogue', 'dialog-box') });
    })

    player.onStateEnter('second', () => {
        player.play('up');
        k.tween(player.pos, officeMap.get('second')[0].worldPos(), 1, newPos => player.pos = newPos, k.easings.linear )
        k.wait(1, () => player.enterState('third'));
    })

    player.onStateEnter('third', () => {
        player.play('idle-up');
        let dialogBox = showDialogueMultiple(
            'receptionist-face', 
            [
             'Welcome to Shogun Corp! You must\nbe Miguel',
             'Mr Shogun is ready for your\ninterview'
            ], 
            'default-voice'
        )

        dialogBox.trigger('play-dialogue', 'dialog-box');
        k.wait(4, () => {
            dialogBox.trigger('play-dialogue', 'dialog-box');
        })
        k.wait(6,() => { dialogBox.trigger('play-dialogue', 'dialog-box') });
        
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
            'shogun_boss-face', 
            [
             'Ah, Mr Miguel! Lets get started with\nyour interview',
             'We will go over your scrolls of\neducation, skills and experience',
             '…What’s that? You came without them? Bold, but foolish',
             'Return to your village and come\nback when you have them all!'
            ], 
            'default-voice')

        dialogBox.trigger('play-dialogue', 'dialog-box');
        k.wait(2, () => {
            dialogBox.trigger('play-dialogue', 'dialog-box');
        })
        k.wait(5,() => { dialogBox.trigger('play-dialogue', 'dialog-box') });
        k.wait(8,() => { dialogBox.trigger('play-dialogue', 'dialog-box') });
        k.wait(11,() => { dialogBox.trigger('play-dialogue', 'dialog-box') });

        dialogBox.onStateEnter('end', () => {
            k.wait(1.5, () => k.go('main', 'player_spawn'));
        })

    })

})

k.scene('cave', async (playerSpawnPoint) => {
    trackGameStage('cave');
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
                player.dance();

                ui.getScroll('experience');
                gameState.updateScrolls('experience');
                openChestEvent.cancel();
                const dialogueBox = player.playerShowDialogue('player_face', 
                    [
                        'I found my experience scroll!\nThe pages tell where I have\nbeen tested', 
                        'Consulting globally sharpened my\nperspective...',
                        '…fast-growing startups taught\nme ownership, speed and\npragmatism...',
                        '...and large tech companies\nrefined my sense of scale and\nsystems thinking!'
                    ],'player-voice');
                
                dialogueBox.onStateEnter('end', () => { 
                    player.play('idle-down');
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


k.scene('thank-you', async () => {
    const SCREEN_HEIGHT = 704;
    const SCREEN_WIDTH = 1280;

    trackGameStage('thank-you');

    k.setBackground(12, 12, 12);
    fadeInScene();

    const menuOptionsComp = () => {
        const selectedColor = new k.Color(255, 255, 255);
        const unselectedColor = new k.Color(248, 169, 69);

        return {
            add() { 
                this.onStateEnter('selected', () => {
                    this.color = selectedColor;
                    k.play('dialog-select');
                    addMenuPlayer(this, -150, -10);
                }) 
                this.onStateEnter('unselected', () => {
                    this.color = unselectedColor;
                    if (this.children.length > 0 ) {
                        this.children.forEach(el => el.destroy());
                    }
                })
            }
        }
    }

    const menuTitleContainer = k.add([
        k.anchor('center'),
        k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 100),
        k.color(50, 169, 69),
        k.opacity(0),
        k.rect(10, 10),
    ])
    
    const parchment = menuTitleContainer.add([
        k.sprite('menu-parchment'),
        k.anchor('center'),
        k.pos(0, -50),
        k.opacity(1)
    ])

    const scrollText = menuTitleContainer.add([
        k.text("ありがとうございます！", {
            size: 40,
            width: 600,
            align: 'center',
            font: "maru-minya",
        }),
        k.anchor('center'),
        k.pos(0, -50),
        k.color(5, 5, 5),
        k.opacity(1)
    ])

    const title = menuTitleContainer.add([
        k.text("THANK YOU FOR PLAYING!",
            {
            size: 48, // 48 pixels tall
            width: 600,
            align: 'center', // it'll wrap to next line when width exceeds this value
            font: "pixelify-sans", // specify any font you loaded or browser built-in
            }
        ),
        k.anchor('center'),
        k.pos(0, 20),
        k.color(20, 155, 96)
    ])


    const credits = menuTitleContainer.add([
        k.anchor('center'),
        k.text("Game Design and Testing by Miguel Jimenez\nGraphics by pixel-boy and limezu",
            {
            size: 20,
            width: 480, // it'll wrap to next line when width exceeds this value
            font: "micro-5",
            align: 'center' // specify any font you loaded or browser built-in
            }
        ),
        k.color(200, 200, 200),
        k.pos(0, 400)
    ])


    const menuOptionsContainer = k.add([
        k.rect(10, 10),
        k.anchor('center'),
        k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 3 * 2),
        k.color(60, 169, 69),
        k.opacity(0),
        'menu-options-container'
    ])

    const downloadResume = menuOptionsContainer.add([
        k.text("See Resume", {
            size: 30, 
            width: 200, 
            align: 'left',
            font: "pixelify-sans"
        }),
        k.color(248, 169, 69),
        'menu-option', 
        k.pos(0, 0),
        k.anchor('center'),
        k.state('selected', ['selected', 'unselected']),
        menuOptionsComp(),
    ])

    const playAgain = menuOptionsContainer.add([
        k.text("Play Again", {
            size: 30, 
            width: 200, 
            align: 'left',
            font: "pixelify-sans"
        }),
        k.color(248, 169, 69),
        'menu-option', 
        k.pos(0, 60),
        k.anchor('center'),
        k.state('unselected', ['selected', 'unselected']),
        menuOptionsComp(),
    ])


    k.onKeyPress('space', () => {
        if(playAgain.state === 'selected') {
            k.wait(1, () => {
                gameState.reset();
                k.go('office');
            });
        } else {
            k.wait(1, () => {
                window.location.assign(resumeUrl);
            });
        }
    })

    k.onKeyPress('down', () => {
        if (downloadResume.state === 'selected') {
            downloadResume.enterState('unselected');
            playAgain.enterState('selected');
        }
    })

    k.onKeyDown('up', () => {
        if (playAgain.state === 'selected') {
            playAgain.enterState('unselected');
            downloadResume.enterState('selected');
        }   
    })


})

k.go('intro', 'player_spawn');
