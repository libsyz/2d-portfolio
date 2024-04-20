import { k } from './kaboomCtx';
import { seconds } from './utils';

const oldMan = k.loadSprite('baddie_green_demon', './src/assets/baddie_green_demon.png', {
    sliceX: 4,
    sliceY: 4,
    anims: {
        'idle': 1
    }
})

export const createBaddieGreenDemon = () => {
    const scale = 1.5;
    

    const baddieGreenDemon = k.add([
        k.sprite('baddie_green_demon'), 
        k.pos(240, 180),
        {
         anim: 'idle',
         state: 'idle'
        },
        k.area({scale: 1.5}),
        k.anchor('center'),
        k.scale(2),
k.body({isStatic: true}),
        'baddie_green_demon'
//scale constrains bounds to the right place :-) 
    ]);

    const patrol = () => {
        k.debug.log(baddieGreenDemon.pos.x);
        baddieGreenDemon.move(200,0)
    }

    const chill = () => {
        // no op
        return 
    }

// We spawn the thing
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
            baddieGreenDemon.move(xVel, yVel)
        }

	})


}   