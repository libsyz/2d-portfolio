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
        dead: 20
    }
})

k.loadSprite('fireball', './src/assets/fireball.png', {
    sliceX: 4,
    sliceY: 1,
    anims: {
        idle: 0,
        move: { from: 0, to: 3, loop: true, speed: 10 }
    }
})



const componentFlash = (k) => {
    const flash = (interval = 0.15) => {
        let _loop = null;

        return {
            id: "flash",

            get isFlashing() {
                return _loop !== null;
            },

            flash(duration = Infinity) {
                if (_loop) this.cancelFlash(false);

                const end = time() + duration;

                this.trigger('flashStart');

                _loop = k.loop(interval, () => {
                    if (time() >= end) return this.cancelFlash();
                    this.hidden = !this.hidden;
                })
            },

            cancelFlash(triggerEvent = true) {
                if (!_loop) return;
                _loop.cancel();
                _loop = null;
                this.hidden = false;
                if (triggerEvent) this.trigger('flashEnd');
            }
        }
    }
    return { flash };
}

const baddiePatrol = () => {
    
    let baddieCounter = 0;
    let xVel = -20 + Math.random() * 40;
    let yVel = -20 + Math.random() * 40;
    
    return { 
        patrol() {
            this.patrolEvent = this.onUpdate( () => {
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

const baddieHealthBar = () => {
    return {
        makeHealthBar() {
            this.healthbarBackground = this.add([
                k.rect(16, 4),
                k.area(),
                k.pos(this.pos.x - 28, this.pos.y - 32),
                k.color(0, 0, 0),
                k.opacity(0),
                'health_bar'
            ])

            this.healthbar = this.add([
                k.rect(16, 4),
                k.area(),
                k.pos(this.pos.x - 28, this.pos.y - 32),
                k.color(255, 0, 0),
                k.opacity(0),
                'health_bar'
            ])

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
        k.color(),
        k.health(3),
        k.scale(scale),
        componentFlash(),
        k.body({isStatic: true}),
        'baddie_green_demon',
        baddiePatrol(),
        baddieHealthBar(),
    ]);

    const baddieGreenDemonPlayerDetectionArea = baddieGreenDemon.add([
        k.rect(160, 160),
        k.area(),
        k.opacity(0),
        k.anchor('center'),
        'baddie_green_demon_player_detection_area'
    ])

    baddieGreenDemonPlayerDetectionArea.onCollide('player', (player) => {
        const fireball = k.add([
            k.sprite('fireball'),
            k.area(),
            k.scale(2),
            k.pos(baddieGreenDemon.pos),
            k.move(player.pos.angle(baddieGreenDemon.pos), 220),
            'fireball'
        ])

        fireball.play('move');
        fireball.angle = player.pos.angle(baddieGreenDemon.pos) + 90;

        fireball.onCollide('player', (player) => { 
            fireball.destroy();
        })

        fireball.onCollide('boundary', () => {
            fireball.destroy();
        })
    })
    
    baddieGreenDemon.on('death', () => {
        baddieGreenDemon.healthbar.destroy();
        baddieGreenDemon.patrolEvent.cancel();
        baddieGreenDemon.unuse('patrol');
        baddieGreenDemon.move(0, 0);
        baddieGreenDemon.play('dead');
        k.wait(0.5, () => {
            baddieGreenDemon.destroy();
        })
    })

    baddieGreenDemon.on('hurt', ()=> {
        baddieGreenDemon.play('dead');
        baddieGreenDemon.healthbarBackground.opacity = 1;
        baddieGreenDemon.healthbar.opacity = 1;
        baddieGreenDemon.healthbar.width = baddieGreenDemon.healthbar.width - 5; 
        baddieGreenDemon.patrolEvent.cancel();
        baddieGreenDemon.flash(1000);
        k.wait(0.2, () => {
            if (baddieGreenDemon.hp() > 0) {
                baddieGreenDemon.play('down');
                baddieGreenDemon.patrol();
            }
        })
    })

    baddieGreenDemon.patrol();
    baddieGreenDemon.makeHealthBar();

    baddieGreenDemon.onCollide('shuriken', (shuriken) => {
            shuriken.destroy();
            baddieGreenDemon.hurt(1);
    })

    return baddieGreenDemon;
} 

    
  
