// import { k } from "./kaboomCtx.js";
// import { createPlayer } from "./player.js";
// import { createMap } from "./map.js";
// import { createOldMan } from "./old_man.js";
// import { showDialogue } from "./utils.js";


// // import sprites

// k.loadSprite('dialogue_box_simple', './src/dialogue_box_simple.png');
// k.loadSprite('shuriken', './src/shuriken.png');
// k.loadSprite('intro_background', './src/intro_background.png');

// // k.scene("main", async () => {
// //     const map = createMap();

// //     const floor = k.add([
// //         k.rect(k.width(), 124),
// //         k.area(),
// //         k.outline(1),
// //         k.pos(0, k.height() - 24),
// //         k.body({ isStatic: true }),
// //     ])
    
// //     const player = createPlayer();
// //     const oldMan = createOldMan();

// //     player.onCollide('gate', () => {
// //         k.debug.log('going through gate');
// //     });

// //     k.onCollide('player', 'old_man_idle', () => {
// //         showDialogue('old_man_face', 'Hello How are you Doing little fella?');
// //     })

// //     k.onCollideEnd('player', 'old_man_idle', () => {
// //         k.destroy(k.get('dialog')[0]);
// //     })


  
        
// // });

// //# Intro Stage

// // k.scene('intro', () => {
// //     k.setBackground(155, 155, 155);
// //     const bgImage = k.add([
// //         k.pos(0),
// //         k.sprite('intro_background'),
// //         k.scale(0.5)
// //     ])


// //     const startGame = k.add([
// //         k.pos(10, 240),
// //         k.text("Start Game", {
// //             size: 20, 
// //             width: 500, 
// //             align: 'center'
// //         }),
// //         k.color(248, 169, 69),
// //         'title', {
// //             isSelected: true
// //         }
// //     ])

// //     const downloadResume = k.add([
// //         k.pos(10, 270),
// //         k.text("See Resume", {
// //             size: 20, 
// //             width: 500, 
// //             align: 'center'
// //         }),
// //         k.color(248, 169, 69),
// //         'title', {
// //             isSelected: false
// //         }
// //     ])

// //     const makeSelector = (titleObj) => { 
// //         titleObj.add([
// //             k.pos(140, -5),
// //             k.sprite('shuriken'),
// //             k.scale(1.5)
// //         ])
// //     }

// //     makeSelector(startGame);


// //     k.onKeyPress('space', () => {
// //         if(startGame.isSelected) {
// //             k.go('main')
// //         } else {
// //             k.debug.log('should open CV');
// //             window.location.assign('https://www.notion.so/mjimenez/Hi-Company-I-m-Miguel-662256cee933457ba77c21fd9fdb4fee?pvs=4');
// //         }
// //     })

// //     k.onKeyPress('down', () => {
// //         if (startGame.isSelected) {
// //             startGame.isSelected = false;
// //             downloadResume.isSelected = true;
// //             k.destroy(startGame.children[0]);
// //             makeSelector(downloadResume);
// //         }
// //     })

// //     k.onKeyDown('up', () => {
// //         if (downloadResume.isSelected) {
// //             startGame.isSelected = true;
// //             downloadResume.isSelected = false;
// //             k.destroy(downloadResume.children[0]);
// //             makeSelector(startGame);
// //         }
// //     })


// // })


// // k.scene('opening', () => {
// //     k.setBackground(200, 200, 200);
// //     k.add([
// //         k.rect(200, 200),
// //         k.color(100, 100, 100)
// //     ])
// // })

// // })
// // const setCamScale = () => {
// //     const resizeFactor = k.width() / k.height();
// //     if (resizeFactor < 1) {
// //       k.camScale(k.vec2(1));
// //     } else {
// //       k.camScale(k.vec2(1.5));
// //     }
// //   }
// k.scene('empty', () => { })
// k.go('empty')