
import { k } from './kaboomCtx';

// sprites 

import greenScrollUISpriteUrl from './../assets/scroll_plant.png';
import redScrollUISpriteUrl from './../assets/scroll_fire.png';
import yellowScrollUISpriteUrl from './../assets/scroll_thunder.png';
import tutorialSpriteUrl from './../assets/tutorial.png';
import speakerSpriteUrl from './../assets/speaker.png'; 


k.loadSprite('greenScrollUI', greenScrollUISpriteUrl);
k.loadSprite('redScrollUI', redScrollUISpriteUrl);
k.loadSprite('yellowScrollUI', yellowScrollUISpriteUrl);
k.loadSprite('tutorial', tutorialSpriteUrl);
k.loadSprite('speaker', speakerSpriteUrl);



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
                k.pos(650, 70),
                k.scale(4),
                k.anchor('center'),
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
        }, 
        {
            spriteName: 'yellowScrollUI',
            keyword: 'experience',
            objectName: 'experience_scroll_ui',
            xPos: 94,
            yPos: 18,
        }, 

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
        // get scroll is a terrible name for this function
        getScroll(scrollKeyword) {
            let foundScroll = scrolls.find((scroll) => scroll.keyword === scrollKeyword)
            foundScroll.gameObject.opacity = 1;
        }

    }
}

const soundToggleComponent = () => {
    return { 
        toggleSound() {
            if (this.soundManager.state === 'on') { 
                this.soundManager.enterState('off');
                this.speaker.get('sound-disabled').forEach(el => el.opacity = 1)
            } else {
                this.soundManager.enterState('on')
                this.speaker.get('sound-disabled').forEach(el => el.opacity = 0)
            }
        }
    }
}

const speakerComponent = () => {

    return {
        initSpeaker() {
            const isTransparent = this.soundManager.state === 'on' ? 0 : 1

            // Speaker sprite
            this.speaker = this.add([
                k.sprite('speaker'),
                k.pos(1200, 40),
                k.scale(0.10),
                k.area(),
                k.anchor('center'),
                'speaker'
            ])

            // Right side of the 'off' cross
            this.speaker.add([
                k.rect(550, 60),
                k.rotate(45),
                k.anchor('center'),
                k.color(225,0,0),
                k.pos(0,0),
                k.opacity(isTransparent),
                'sound-disabled'
            ])


        // Left side of the 'off' cross
            this.speaker.add([
                k.rect(550, 60),
                k.rotate(-45),
                k.anchor('center'),
                k.color(225,0,0),
                k.pos(0,0),
                k.opacity(isTransparent),
                'sound-disabled',
            ])

            k.onClick('speaker', () => {
                this.toggleSound();
            })
        }

    }

}

export const createUI = (gameState, soundManager) => { 
    const hud = k.add([
         k.fixed(),  
         k.z(999),
         tutorialComponent(gameState),
         scrollsComponent(gameState),
         speakerComponent(),
         soundToggleComponent(),
         'ui',
         {
            soundManager: soundManager
         }
    ]);

    hud.initTutorial();
    hud.initScrolls();
    hud.initSpeaker(soundManager);
    return hud;
}


// what code would I love to have for my UI

// createUI(gamestate) => invokes the UI, passes the gamestate

// UI.refresh()
// -> applies the right opacity to all the scrolls based on the gamestate


