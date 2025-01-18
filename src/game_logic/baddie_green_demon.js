import { k } from './kaboomCtx';
import { seconds } from './utils';

k.loadSprite('baddie_green_demon', './src/assets/baddie_green_demon.png', {
    sliceX: 4,
    sliceY: 6,
    anims: {
        idle: 0,
        down: { from: 0, to: 3, loop: true, speed: 4 },
        up: { from: 4, to: 7, loop: true, speed: 4 },
        left: { from: 8, to: 11, loop: true, speed: 4 },
        right: { from: 12, to: 15, loop: true, speed: 4 },
        dead: 16
    }
})

const baddiePatrol = () => {

    let baddieCounter = 0;
    let xVel = -20 + Math.random() * 40;
    let yVel = -20 + Math.random() * 40;
    
    return { 
        patrol() {
            this.onUpdate( () => {
                if ( baddieCounter == seconds(2) ) {
                    baddieCounter = 0;
                    xVel = -20 + Math.random() * 40;
                    yVel = -20 + Math.random() * 40;

                    if( xVel > 0 && xVel > yVel ) {
                        this.play('right');
                    } else if ( xVel < 0 && xVel > yVel ) {
                        this.play('left');
                    } else if ( yVel > 0 ) {
                        this.play('down');
                    } else { 
                        this.play('up');
                    }
                } else if ( baddieCounter < seconds(2) ) {
                    baddieCounter++;
                    this.move(xVel, yVel);
                } 
            })
        }
    }
}

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
        'baddie_green_demon',
        baddiePatrol()
//scale constrains bounds to the right place :-) 
    ]);
    
    baddieGreenDemon.on('death', () => {
        baddieGreenDemon.destroy();
    })

    baddieGreenDemon.patrol();

    return baddieGreenDemon;

} 

    
    // every two seconds, patrols on random direction
    // k.onUpdate("baddie_green_demon", (baddie) => {

    //     // there is a current animation playing
    //     let currentAnim = 'idle';

    //     if (baddieCounter < seconds(2)) {
    //         baddieGreenDemon.play(currentAnim); 
    //         baddieCounter += 1 
    //     } else { 
    //         baddieCounter = 0;
    //         baddieGreenDemon.stop(currentAnim);
    //         xVel = -20 + Math.random() * 40;
    //         yVel = -20 + Math.random() * 40;

    //         if (xVel > 0) {
    //             currentAnim = 'right';
    //         } else if (xVel < 0) {
    //             currentAnim = 'left';
    //         }
    //     }


    //     if (baddieCounter < 60 ) {
    //         baddieGreenDemon.move(xVel, yVel);
            
    //     }
	// })

    // baddieGreenDemon.onCollide('arrow', (arrow) => {
    //     baddieGreenDemon.hurt(1);
    //     arrow.destroy();
    // })

