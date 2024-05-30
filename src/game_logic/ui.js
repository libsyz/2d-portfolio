
import { k } from './kaboomCtx';



// sprites 
k.loadSprite('greenScrollUI', './src/assets/scroll_plant.png');

// Lets see if I can add a scroll

export const createUI = () => { 
    const hud = k.add([k.fixed(), 'ui']);
    hud.add([
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

    return hud;
}

