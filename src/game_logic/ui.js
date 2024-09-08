
import { k } from './kaboomCtx';



// sprites 
k.loadSprite('greenScrollUI', './src/assets/scroll_plant.png');
k.loadSprite('redScrollUI', './src/assets/scroll_fire.png');
k.loadSprite('tutorial', './src/assets/tutorial.png');


const tutorial = (gameState) => {
    let tutorialContainer;
    return {
        init() {
            if (!gameState.tutorial.isComplete()) {
                this.addTutorial();
            }
        },
        addTutorial(gameState) {
            tutorialContainer = this.add([
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
    
            tutorialContainer.onKeyDown('space', this.removeTutorial);
        },
        removeTutorial() {
            k.tween(tutorialContainer.pos, k.vec2(tutorialContainer.pos.x, tutorialContainer.pos.y + 200 ), 0.25 ,
            (newPos) =>  tutorialContainer.pos = newPos )
            gameState.tutorial.complete(); 
        }
    }
}

export const createUI = (gameState) => { 
    const hud = k.add([
         k.fixed(),  
         k.z(999),
         tutorial(gameState),
         'ui'
    ]);

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
        'education_scroll_ui'
    ])

    const skillsScroll = hud.add([
        k.sprite('redScrollUI'),
        k.pos(68, 18),
        k.scale(2.25),
        k.opacity(0.3), 
        { 
            getScroll() {
                this.opacity = 1;
            }
        },
        'skills_scroll_ui'
    ])


    // update scrolls
    if (gameState.scrolls.includes('education')) {
        educationScroll.getScroll();
    }

    hud.init();
    return hud;
}


// what code would I love to have for my UI

// createUI(gamestate) => invokes the UI, passes the gamestate

// UI.refresh()
// -> applies the right opacity to all the scrolls based on the gamestate


