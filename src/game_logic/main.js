import { k } from "./kaboomCtx.js";
import { createPlayer, createOfficePlayer } from "./player.js";
import { createOfficeMap } from "./office_map.js";
import { createMap } from "./map.js";
import { createHouseMap } from "./house_map.js";
import { createInterviewer } from "./interviewer.js";
import { showDialogue, showDialogueHouse, fadeInScene } from "./utils.js";
import { createBaddieGreenDemon } from "./baddie_green_demon.js";
import { createUI } from "./ui.js";
import { createGameState } from "./game_state.js";

k.setBackground(k.color(255, 255, 255));

// import sprites that need to be loaded before anything else

k.loadSprite('dialogue_box_simple', './src/assets/dialogue_box_simple.png');
k.loadSprite('dialogue_info', './src/assets/dialogue_info.png', {
    sliceX: 4, 
    sliceY: 1,
    anims: {
        'show': {from: 0, to: 3, loop: true, speed: 5}
    }
})
k.loadSprite('shuriken', './src/assets/shuriken.png');
k.loadSprite('intro_background', './src/assets/intro_background.png');
k.loadSprite('scroll', './src/assets/scroll.png');
k.loadSprite('player_face', './src/assets/player_face.png');

// load gamestate, available to all the scenes

const gameState = createGameState();

// load scenes

k.scene("main", async (playerSpawnPoint) => {
    
    const map = createMap();
    const ui = createUI(gameState);
    fadeInScene();

    const player = createPlayer();
    player.moveTo(map.get(playerSpawnPoint)[0].worldPos())

    const activeScene = k.get('active_scene')[0]

    k.camPos(activeScene.worldPos())


    k.onCollide('player', 'old_man_idle', (_, oldMan) => {
        oldMan.dialogShow();
        showDialogue('old_man_face', 'go through the pearly gates to find your skills');
    })

    k.onCollideEnd('player', 'old_man_idle', (_, oldMan) => {
        oldMan.dialogHide();
        k.destroy(k.get('dialog')[0]);
    })

    k.onCollide('player', 'mailbox', () => {
        showDialogue('player_face', 'You can reach me at miguel.leo.jimenez@gmail.com');
    })

    k.onCollideEnd('player', 'mailbox', () => {
        k.destroy(k.get('dialog')[0]);
    })

    k.onCollide('player', 'house_door', () => {
        k.go('house', 'player_spawn');
    })
});

k.scene('house', async (playerSpawnPoint) => { 


   const houseMap = createHouseMap(gameState);
   const ui = createUI(gameState);
   
   // ui needs to read from the gamestate and update if necessary

   fadeInScene();

   const player = createPlayer();
   player.canAttack = false;
   player.moveTo(houseMap.get(playerSpawnPoint)[0].worldPos())

    player.onUpdate( () =>  {
        k.camPos(player.worldPos());
    })


    k.onCollide('player', 'psychology_diploma', () => {
        showDialogueHouse(
            'player_face', 
            [
                'This is my psychology degree', 
                'I learned so much about humans here, but also thinking machines',
                'Everyone says my work has nothing to do with psychology, but I think it does!'
            ]
        )
    })


    k.onCollideEnd('player', 'psychology_diploma', () => { 
        k.get('dialog').forEach(el => k.destroy(el));
    })

    let treasureCollision = k.onCollide('education_treasure_chest', 'player', (treasureChest, player) => {
        let openChestAction = k.onKeyRelease('space', () => { 
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

    
        k.tween(
            edScroll.pos, 
            k.vec2(edScroll.pos.x, edScroll.pos.y - 20),
            1,
            (posVal) => { edScroll.pos = posVal }   
        )

        openChestAction.cancel();

        showDialogueHouse(
            'player_face', 
            [
                'I found my education scroll!', 'I suddenly know kung fu!']);
        // move it up a bit
        // show a dialogue mentioning what it is 
        // destroy the dialogue
        // destroy the scroll
        gameState.updateScrolls('education');
        
        // what a terrible line of code
        k.get('ui')[0].children[0].getScroll();
        })

        gameState.checkFinished();
    })

    k.onCollideEnd('education_treasure_chest', 'player', () => {
        if (gameState.scrolls.includes('education') === true) { 
            k.get('dialog').forEach(el => k.destroy(el));
            k.get('education_scroll').forEach(el => k.destroy(el));
            treasureCollision.cancel();
        }

        
    })


    k.onCollide('player', 'christin', (_, christin) => {
            christin.dialogShow();
            showDialogueHouse('christin_face', ['Are you looking for your experience scroll?', 'It has to be either on the living room or in your room'])
    })

    k.onCollideEnd('player', 'christin', (_, christin) => { 
        christin.dialogHide();
        k.get('dialog').forEach(el => k.destroy(el));
    })

    k.onCollide('player', 'elias', (_, elias) => {
        elias.dialogShow();
        showDialogueHouse('elias_face', ['Papi Papi I cant wait to go down to the beach!'])
}) 

    k.onCollideEnd('player', 'elias', (_, elias) => { 
        elias.dialogHide();
        k.get('dialog').forEach(el => k.destroy(el));
    })

    k.onCollide('player', 'book_shelf', () => { 
        showDialogueHouse('player_face', 
            ['These are some of my favorite books', 
             'There are loads of stuff about psychology, product management, systems thinking...',
             'Virtual readers are cool, but there is something about paper I still love',
             'You can check a full list of books here'])
    })

    k.onCollideEnd('player', 'book_shelf', () => {
        k.get('dialog').forEach(el => k.destroy(el));
    })

    k.onCollide('player', 'globe', () => { 
        showDialogueHouse('player_face', 
            ['This globe has pins with the places we have been to', 
             'I have worked in 30+ countries, and lived in Europe, Asia and Latin America',
             'Travelling is really a cure for ignorance',
             'Cant wait for the next adventure!'])
    })

    k.onCollideEnd('player', 'globe', () => {
        k.get('dialog').forEach(el => k.destroy(el));
    })

    k.onCollide('player', 'painting', () => { 
        showDialogueHouse('player_face', 
            ['A beautiful picture of Tarifa, Cadiz', 
             'You can see Africa through the sea',
             'My dads family comes from here'])
    })

    k.onCollideEnd('player', 'globe', () => {
        k.get('dialog').forEach(el => k.destroy(el));
    })

    k.onCollide('player', 'exit', () => {
        k.go('main', 'house_exit_spawn');
    })

})

//# Intro Stage

// k.scene('intro', () => {
//     k.setBackground(155, 155, 155);
//     const bgImage = k.add([
//         k.pos(0),
//         k.sprite('intro_background'),
//         k.scale(0.5)
//     ])

//     const startGame = k.add([
//         k.pos(10, 240),
//         k.text("Start Game", {
//             size: 20, 
//             width: 500, 
//             align: 'center'
//         }),
//         k.color(248, 169, 69),
//         'title', {
//             isSelected: true
//         }
//     ])

//     const downloadResume = k.add([
//         k.pos(10, 270),
//         k.text("See Resume", {
//             size: 20, 
//             width: 500, 
//             align: 'center'
//         }),
//         k.color(248, 169, 69),
//         'title', {
//             isSelected: false
//         }
//     ])

//     const makeSelector = (titleObj) => { 
//         titleObj.add([
//             k.pos(140, -5),
//             k.sprite('shuriken'),
//             k.scale(1.5)
//         ])
//     }

//     makeSelector(startGame);

//     k.onKeyPress('space', () => {
//         if(startGame.isSelected) {
//             k.go('opening');
//         } else {
//             k.debug.log('should open CV');
//             window.location.assign('https://www.notion.so/mjimenez/Hi-Company-I-m-Miguel-662256cee933457ba77c21fd9fdb4fee?pvs=4');
//         }
//     })

//     k.onKeyPress('down', () => {
//         if (startGame.isSelected) {
//             startGame.isSelected = false;
//             downloadResume.isSelected = true;
//             k.destroy(startGame.children[0]);
//             makeSelector(downloadResume);
//         }
//     })

//     k.onKeyDown('up', () => {
//         if (downloadResume.isSelected) {
//             startGame.isSelected = true;
//             downloadResume.isSelected = false;
//             k.destroy(downloadResume.children[0]);
//             makeSelector(startGame);
//         }
//     })
// })


// k.scene('opening', () => {
//     k.setBackground(200, 200, 200);
//     k.add([
//         k.sprite('interview_room'),
//         k.scale(0.5)
//     ])

//     const player = createPlayer();
//     const interviewer = createInterviewer();
    
//     k.wait(2, async () => {
//         await showDialogue('interviewer_face', "Thanks for coming to the interview Mr Miguel");
//     });

//     k.wait(4, async () => {
//         await showDialogue('interviewer_face', "Unfortunately your CV is empty! This is disgraceful");
//     })

//     k.wait(6, async () => {
//         await showDialogue('interviewer_face', "Go back to your village and bring us a complete resume");
//     })

//     k.wait(8, async () => {
//         await showDialogue('interviewer_face', "We want to see experience, education and skills!");
//     })

//     k.wait(10, () => {
//         k.go('main');
//     })

    
// })

// k.scene('skills_quest', () => { 
//     k.setBackground(201, 197, 197);
//     createPlayer();
    
//     for (let i = 0; i < 3; i++) {
//         createBaddieGreenDemon();    
//     }

//     k.onCollide('arrow', 'baddie_green_demon', (arrow, baddie) => {
//         arrow.destroy();
//         baddie.color = k.color(255, 255, 255);
//         baddie.scale = 2.5;
//         k.wait(0.2, () => {
//             baddie.destroy();

//         })
        
//     }) 


//     k.onCollide('player', 'baddie_green_demon', (player, baddie) => {
//         k.shake(2);
//         // player blinks as it takes damage
//         k.wait(0.1, () => {
//                 player.opacity = 0;
//         })

//         k.wait(0.2, () => {
//             player.opacity = 1;
//         })

//         k.wait(0.3, () => {
//                 player.opacity = 0;
//         })

//         k.wait(0.4, () => {
//             player.opacity = 1;
//         })
//     })

//     k.onCollide('player', 'scroll', (player, scroll) => {
//         scroll.destroy();
//     })


//     k.onDestroy('baddie_green_demon', (baddie) => {
//         // render a parchment if all baddies are dead
//         const baddieCount = k.get('baddie_green_demon').length;


//         if (baddieCount === 0) { 
//             k.add([
//                 k.sprite('scroll'),
//                 k.pos(baddie.pos),
//                 k.scale(2),
//                 k.area(),
//                 k.body(),
//                 'scroll'
//             ])
//         }
//     })
    

// })

// // test Scene with Camera logic that follows the character 
// k.scene('camera_follow_test', () => {
//     k.camScale(2);

//     // Easy
//     // Make the camera follow the player
//     const map = k.add([
//         k.rect(1120 * 3, 600 * 3),
//         k.color(41, 41, 41),
//         k.z(0),
//         k.anchor('center'),
//         k.pos(k.center())
//     ])


//     const freeMovement = k.add([
//         k.rect(200, 200),
//         k.color(125, 125, 125),
//         k.z(2),
//         k.anchor('center'),
//         k.pos(k.center())
//     ])

//     const bounds = k.add([
//         k.rect(400, 400),
//         k.color(198, 182, 226),
//         k.z(1),
//         k.anchor('center'),
//         k.pos(k.center()),
//     ])

//     const player = createPlayer();
//     player.moveTo(k.center());
//     player.z = 3

    
//     // if only I could figure this out dynamically based on screen size hahaha
//     // this only works on Mac 13 inch screen. super weak

//     let camBounds = { left: 620, right: 820, up: 277, down: 477}
    
//     player.onUpdate(() => {
//         k.debug.log(k.camPos());
//         const camCoords = k.camPos();
        
//         // if player is inside the bounds, camera moves both x and y
        
//         // if player is inside the x bounds but outside y bounds, move only x
//         // if player is inside the y bounds but outside the x bounds, move only y

//         if (player.pos.x > camBounds.left && camBounds.right > player.pos.x &&
//             player.pos.y > camBounds.up && camBounds.down > player.pos.y ) 
//         { 
//             k.camPos(player.worldPos())
//         } 
//         else if (
//             player.pos.x > camBounds.left && camBounds.right > player.pos.x &&
//             player.pos.y < camBounds.up
//         )
//         {
//             k.camPos( player.pos.x , camBounds.up )

//         } else if ( 
//             player.pos.x > camBounds.left && camBounds.right > player.pos.x &&
//             player.pos.y > camBounds.down
//         ) 
//         {
//             k.camPos( player.pos.x , camBounds.down )
//         } else if (
//             player.pos.y > camBounds.up && camBounds.down > player.pos.y &&
//             player.pos.x > camBounds.right
//         ) {
//             k.camPos( camBounds.right, player.pos.y )
//         } else if (
//             player.pos.y > camBounds.up && camBounds.down > player.pos.y &&
//             player.pos.x < camBounds.left
//         ) {
//             k.camPos( camBounds.left, player.pos.y )
//         } else {
//             return
//         }

//     })


    

//     // Med
//     // Make the camera follow the player, but stop following when approaching screen limit


//     // Hard
//     // Transition the from one point to another after the player has crossed a line


// })


// test Scene with Camera logic that switches to another scene when the character moves out 

// k.scene('camera_walkout_test', () => { 
//     const firstScene = k.add([
//         k.rect(1120, 600),
//         k.color(41, 41, 41)
//     ])

//     const centerPiece = k.add([
//         k.rect(30, 30),
//         k.color(0, 0, 0),
//         k.z(2),
//         k.anchor('center'),
//         k.pos(1120 / 2 , 600 / 2)
//     ])

//     const secondScene = k.add([
//         k.rect(1120, 600),
//         k.color(120, 120, 120),
//         k.pos(firstScene.renderArea().pos.x, firstScene.renderArea().pos.x + 600),
//         k.z(2)
//     ])

//     const player = createPlayer();
//     player.moveTo(k.vec2(1120/2, 600))
//     player.z = 3


//     centerPiece.onUpdate(() => {
//         k.camPos(centerPiece.worldPos())
//     })

//     player.onUpdate( () => {
//         k.debug.log(player.pos.y);
//         if ( player.pos.y > 600 ) {
//             centerPiece.moveTo(1120/2, 600 * 2 * 0.75, 1000)
//         } 
//     })
// })


k.scene('office', async () => { 
    const officeMap = await createOfficeMap();
    const player = await createOfficePlayer();

    player.moveTo(officeMap.get('player_spawn')[0].worldPos());

    player.onStateEnter('spawn', () => {
        k.debug.log('spawning player');
        player.play('right');
        k.tween(player.pos, officeMap.get('first')[0].worldPos(), 1, newPos => player.pos = newPos, k.easings.linear )
        k.wait(1, () => player.enterState('first'))
    })

    player.onStateEnter('first', () => {
        player.play('idle-down');
        let dialogBox = showDialogueHouse('player-face', 
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
        let dialogBox = showDialogueHouse('receptionist-face', 
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
        
        let dialogBox = showDialogueHouse('shogun_boss-face', 
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


k.go('main', 'player_spawn');

// k.go('main', k.vec2(50,460));

