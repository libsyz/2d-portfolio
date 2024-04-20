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
k.loadSprite('interview_room', './src/assets/interview_room.png')

k.scene("main", async () => {
    const map = createMap();

    const floor = k.add([
        k.rect(k.width(), 124),
        k.area(),
        k.outline(1),
        k.pos(0, k.height() - 24),
        k.body({ isStatic: true }),
    ])
    
    const player = createPlayer();
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
});

//# Intro Stage

k.scene('intro', () => {
    k.setBackground(155, 155, 155);
    const bgImage = k.add([
        k.pos(0),
        k.sprite('intro_background'),
        k.scale(0.5)
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
            k.sprite('shuriken'),
            k.scale(1.5)
        ])
    }

    makeSelector(startGame);

    k.onKeyPress('space', () => {
        if(startGame.isSelected) {
            k.go('main')
        } else {
            k.debug.log('should open CV');
            window.location.assign('https://www.notion.so/mjimenez/Hi-Company-I-m-Miguel-662256cee933457ba77c21fd9fdb4fee?pvs=4');
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


k.scene('opening', () => {
    k.setBackground(200, 200, 200);
    k.add([
        k.sprite('interview_room'),
        k.scale(0.5)
    ])

    const player = createPlayer();
    const interviewer = createInterviewer();
    
    k.wait(2, async () => {
        await showDialogue('interviewer_face', "Thanks for coming to the interview Mr Miguel");
    });

    k.wait(4, async () => {
        await showDialogue('interviewer_face', "Unfortunately your CV is empty! This is disgraceful");
    })

    k.wait(6, async () => {
        await showDialogue('interviewer_face', "Go back to your village and bring us a complete resume");
    })

    k.wait(8, async () => {
        await showDialogue('interviewer_face', "We want to see experience, education and skills!");
    })

    k.wait(10, () => {
        k.go('main');
    })

    
})


k.scene('skills_quest', () => { 
    k.setBackground(201, 197, 197);
    createPlayer();
    createBaddieGreenDemon();

})

k.go('skills_quest');