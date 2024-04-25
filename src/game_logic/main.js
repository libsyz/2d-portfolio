import { k } from "./kaboomCtx.js";
import { createPlayer } from "./player.js";
import { createMap } from "./map.js";
import { createOldMan } from "./old_man.js";
import { createInterviewer } from "./interviewer.js";
import { showDialogue } from "./utils.js";
import { createBaddieGreenDemon } from "./baddie_green_demon.js";



// import sprites

k.loadSprite('dialogue_box_simple', './src/assets/dialogue_box_simple.png');
k.loadSprite('shuriken', './src/assets/shuriken.png');
k.loadSprite('intro_background', './src/assets/intro_background.png');
k.loadSprite('interview_room', './src/assets/interview_room.png');
k.loadSprite('scroll', './src/assets/scroll.png');
k.loadSprite('player_face', './src/assets/player_face.png');

k.scene("main", async () => {
    const map = createMap();
    
    const player = createPlayer();
    player.moveTo(k.vec2(0, 0), 100)
    const oldMan = createOldMan();


    player.onCollide('gate', () => {
        k.go('skills_quest');
    });

    k.onCollide('player', 'old_man_idle', () => {
        showDialogue('old_man_face', 'go through the pearly gates to find your skills');
    })

    k.onCollideEnd('player', 'old_man_idle', () => {
        k.destroy(k.get('dialog')[0]);
    })

    k.onCollide('player', 'mailbox', () => {
        showDialogue('player_face', 'You can reach me at miguel.leo.jimenez@gmail.com');
    })

    k.onCollideEnd('player', 'mailbox', () => {
        k.destroy(k.get('dialog')[0]);
    })
});

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


k.go('main');

