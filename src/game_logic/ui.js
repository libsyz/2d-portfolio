
import { k } from './kaboomCtx';

// sprites 
k.loadSprite('greenScrollUI', './src/assets/scroll_plant.png');
k.loadSprite('redScrollUI', './src/assets/scroll_fire.png');
k.loadSprite('tutorial', './src/assets/tutorial.png');


const tutorialComponent = (gameState) => {
    let tutorialContainer;
    let removeTutorialEvent;

    return {
        initTutorial() {
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
    
            removeTutorialEvent = tutorialContainer.onKeyDown('space', this.removeTutorial);
        },
        removeTutorial() {
            removeTutorialEvent.cancel();
            k.tween(tutorialContainer.pos, k.vec2(tutorialContainer.pos.x, tutorialContainer.pos.y + 200 ), 0.25 ,
            (newPos) =>  tutorialContainer.pos = newPos )
            gameState.tutorial.complete(); 
        }
    }
}

const scrollsComponent = (gameState) => {
    let scrolls = [
        {
            spriteName: 'greenScrollUI',
            keyword: 'education',
            objectName: 'education_scroll_ui'
        },
        {
            spriteName: 'redScrollUI',
            keyword: 'skills',
            objectName: 'skills_scroll_ui'
        }
    ]

    return { 
        initScrolls() {
            scrolls.forEach((scroll) => {
                this.render(scroll);
            })
        },
        render(scroll) {
            scroll.gameObject = this.add([
                k.sprite('greenScrollUI'),
                k.pos(18, 18),
                k.scale(2.25),
                gameState.scrolls.includes('education') ? k.opacity(1) : k.opacity(0.3),
                'education_scroll_ui'
            ])
        },
        getScroll(scrollKeyword) {
            gameState.scrolls.push(scrollKeyword);
            debugger
            let foundScroll = scrolls.find((scroll) => scroll.keyword === scrollKeyword)
            foundScroll.gameObject.opacity = 1;
        }

    }
}

export const createUI = (gameState) => { 
    const hud = k.add([
         k.fixed(),  
         k.z(999),
         tutorialComponent(gameState),
         scrollsComponent(gameState),
         'ui'
    ]);

    hud.initTutorial();
    hud.initScrolls();
    return hud;
}


// what code would I love to have for my UI

// createUI(gamestate) => invokes the UI, passes the gamestate

// UI.refresh()
// -> applies the right opacity to all the scrolls based on the gamestate


