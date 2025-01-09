import { k } from './kaboomCtx';
import { seconds } from './utils';

k.loadSprite('baddie_green_demon', './src/assets/baddie_green_demon.png', {
    sliceX: 4,
    sliceY: 4,
    anims: {
        'idle': 1
    }
})

export const createBaddieGreenDemon = () => {
    const scale = 3.5;
    
    const baddieGreenDemon = k.add([
        k.sprite('baddie_green_demon'), 
        k.pos(20, 20),
        {
         anim: 'idle',
         state: 'idle'
        },
        k.area(),
        k.anchor('center'),
        k.health(3),
        k.scale(scale),
        k.body({isStatic: true}),
        'baddie_green_demon'
//scale constrains bounds to the right place :-) 
    ]);

    let baddieCounter = 0;
    let xVel = -20 + Math.random() * 40
    let yVel = -20 + Math.random() * 40
    // every two seconds, patrols on random direction
    k.onUpdate("baddie_green_demon", (baddie) => {

        if (baddieCounter < seconds(2)) {
            baddieCounter += 1 
        } else { 
            baddieCounter = 0;
            xVel = -20 + Math.random() * 40;
            yVel = -20 + Math.random() * 40;
        }

        if (baddieCounter < 60 ) {
            baddieGreenDemon.move(xVel, yVel);
        }
	})

    baddieGreenDemon.onCollide('arrow', (arrow) => {
        baddieGreenDemon.hurt(1);
        arrow.destroy();
    })

    baddieGreenDemon.on('death', () => {
        baddieGreenDemon.destroy();
    })

    return baddieGreenDemon;
}   

