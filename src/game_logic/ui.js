
import { k } from './kaboomCtx';



// sprites 
k.loadSprite('greenScrollUI', './src/assets/scroll_plant.png');
k.loadSprite('tutorial', './src/assets/tutorial.png');

// Lets see if I can add a scroll

export const createUI = (gameState) => { 
    const hud = k.add([k.fixed(),  k.z(999),'ui' ]);

    if (gameState.tutorial.isComplete() === false) {
        const tutorialContainer = hud.add([
            k.rect(1300, 210),
            k.pos(0, 520),
            k.color(0,0,0),
            k.opacity(0.5)
        ])
        
        tutorialContainer.add([
            k.pos(180, 15),
            k.scale(4),
            k.sprite('tutorial')
        ])

        tutorialContainer.onKeyDown('space', () => {
            k.tween(tutorialContainer.pos, k.vec2(tutorialContainer.pos.x, tutorialContainer.pos.y + 200 ), 0.25 ,
            (newPos) =>  tutorialContainer.pos = newPos )
            gameState.tutorial.complete(); 
        })

    }



    const educationScroll = hud.add([
        k.sprite('greenScrollUI'),
        k.pos(18, 18),
        k.scale(2.25),
        k.opacity(0.3), 
        { 
            getScroll() {
                this.opacity = 1;
            }
        },
        'skill_scroll_UI'
    ])


    // update scrolls
    if (gameState.scrolls.includes('education')) {
        educationScroll.getScroll();
    }

    return hud;
}

