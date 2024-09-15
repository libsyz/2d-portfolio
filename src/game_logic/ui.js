
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
            objectName: 'education_scroll_ui',
            xPos: 18,
            yPos: 18,
        },
        {
            spriteName: 'redScrollUI',
            keyword: 'skills',
            objectName: 'skills_scroll_ui',
            xPos: 56,
            yPos: 18,
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
                k.sprite(scroll.spriteName),
                k.pos(scroll.xPos, scroll.yPos),
                k.scale(2.25),
                gameState.scrolls.includes(scroll.keyword) ? k.opacity(1) : k.opacity(0.3),
                scroll.objectName
            ])
        },
        getScroll(scrollKeyword) {
            gameState.scrolls.push(scrollKeyword);
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


