import { k } from './kaboomCtx';
import { seconds } from './utils';
import { createKey } from './key.js';
import { fxComp } from './utils';
import { drawShadow } from './utils';
import baddieGreenDemonSpriteUrl from './../assets/baddie_green_demon.png';
import fireballSpriteUrl from './../assets/fireball.png';
import baddieFireballThrowSoundUrl from './../audio/fx/baddie-fireball-throw.mp3';
import baddieHurtSoundUrl from './../audio/fx/baddie-hurt.mp3';

k.loadSprite('baddie_green_demon', baddieGreenDemonSpriteUrl, {
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

k.loadSprite('fireball', fireballSpriteUrl, {
    sliceX: 4,
    sliceY: 1,
    anims: {
        idle: 0,
        move: { from: 0, to: 3, loop: true, speed: 10 }
    }
})

k.loadSound('baddie-fireball-throw', baddieFireballThrowSoundUrl);
k.loadSound('baddie-hurt', baddieHurtSoundUrl);


k.loadShader("saturate", null, `
    uniform float u_time;
    uniform vec2 u_pos;
    uniform vec2 u_size;
    
    vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
        vec4 c = def_frag();
        return c + vec4(mix(vec3(0.0), vec3(1.1), u_time), 0.0);
    }`
)

const componentFlash = () => {
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
    
    return { 
        patrolSwitch() {
            this.xVel = -this.xVel 
            this.yVel = -this.yVel

            this.setDirection();
        },
        patrol() {
            this.patrolEvent = this.onUpdate( () => {
                if ( baddieCounter === seconds(2) ) {
                    baddieCounter = 0;
                    this.xVel = -20 + Math.random() * 40;
                    this.yVel = -20 + Math.random() * 40;
                    this.setDirection();
                    
                } else if ( baddieCounter < seconds(2) ) {
                    baddieCounter++;
                    this.move(this.xVel, this.yVel);
                } 
            })

            this.onCollide('boundary', () => {
                this.patrolSwitch();
            }) 

            this.onCollide('baddie_green_demon', () => {
                this.patrolSwitch();
            })
        },
        setDirection() {
            if( this.xVel > 0 && 
                this.xVel > this.yVel ) {
                this.direction = 'right';
                this.play('right');
            } else if ( this.xVel < 0 
                        && this.xVel > this.yVel ) {
                this.direction = 'left';
                this.play('left');
            } else if ( this.yVel > 0 ) {
                this.direction = 'down';
                this.play('down');
            } else { 
                this.direction = 'up';
                this.play('up');
            }
        }  
    } 
}

const baddieHealthBar = () => {
    return {
        makeHealthBar() {

            this.healthbarBackground = this.add([
                k.rect(16, 4),
                k.area(),
                k.pos(-8, -14),
                k.color(0, 0, 0),
                k.opacity(0),
                'health_bar'
            ])

            this.healthbar = this.add([
                k.rect(16, 4),
                k.area(),
                k.pos(-8, -14),
                k.color(255, 0, 0),
                k.opacity(0),
                'health_bar'
            ])

        }
    }
}


export const createBaddieGreenDemon = (gameState, baddieType, baddieLocation, shadowArgs = {}) => {
    const scale = 3.5;

    if (baddieType === 'forest' && 
        gameState.isBaddieGreenDemonInForestDead === true ) {
        return;
    }

    if (baddieType === 'cave' && 
        gameState.playerHasKey === true ) {
        return;
    }



    const baddieGreenDemon = k.add([
        { draw() { drawShadow(shadowArgs); } },
        k.sprite('baddie_green_demon'), 
        k.pos(20, 20),
        {
         anim: 'down',
         direction: 'down',
         type: baddieType,
         xVel: -20 + Math.random() * 40,
         yVel: -20 + Math.random() * 40
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
        {
            fxCollection: {
                fireball: 'baddie-fireball-throw',
                    hurt: 'baddie-hurt'
            }
        },
        fxComp()
    ]);

    baddieGreenDemon.moveTo(baddieLocation);
    baddieGreenDemon.setDirection();

    const baddieGreenDemonPlayerDetectionArea = baddieGreenDemon.add([
        k.rect(160, 160),
        k.area(),
        k.opacity(0),
        k.anchor('center'),
        'baddie_green_demon_player_detection_area'
    ])

    // Throws fireball at player when enters range

    baddieGreenDemonPlayerDetectionArea.onCollide('player', (player) => {
        if (!baddieGreenDemon.fireBallLoop) {
            
            baddieGreenDemon.fireBallLoop = k.loop(1, () => {

                let fireballXOffset = 0;
                let fireballYOffset = 0;
                let direction = baddieGreenDemon.direction;

                if ( direction === "up" ) {
                    fireballYOffset = -32
                } else if ( direction === "down" ) {
                    fireballYOffset = +32
                } else if ( direction === "right" ) {
                    fireballXOffset = 32
                } else if ( direction === "left" ) {
                    fireballXOffset = -32
                } 


                const fireball = k.add([
                    k.sprite('fireball'),
                    k.area(),
                    k.scale(2),
                    k.anchor('center'),
                    k.pos(baddieGreenDemon.pos.x + fireballXOffset, 
                        baddieGreenDemon.pos.y + fireballYOffset),
                    k.move(player.pos.angle(baddieGreenDemon.pos), 220),
                    'fireball'
                ])

                baddieGreenDemon.fxPlay('fireball');
                fireball.play('move');
                fireball.angle = player.pos.angle(baddieGreenDemon.pos) + 90;

                fireball.onCollide('player', () => { 
                    fireball.destroy();
                })

                fireball.onCollide('boundary', () => {
                    fireball.destroy();
                })

            })
        }
    })

    baddieGreenDemonPlayerDetectionArea.onCollideEnd('player', () =>{
        baddieGreenDemon.fireBallLoop.cancel();
        baddieGreenDemon.fireBallLoop = null;
    })
    
    baddieGreenDemon.on('death', () => {
        if (baddieGreenDemon.fireBallLoop) { 
            baddieGreenDemon.fireBallLoop.cancel();

            baddieGreenDemon.fireBallLoop = null;
        }

        baddieGreenDemon.healthbar.destroy();
        baddieGreenDemonPlayerDetectionArea.destroy();
        baddieGreenDemon.patrolEvent.cancel();
        baddieGreenDemon.unuse('patrol');
        baddieGreenDemon.move(0, 0);
        baddieGreenDemon.play('dead');

        if (baddieType === 'forest') {
            gameState.killBaddieGreenDemonInForest();
        }

        if (baddieType === 'cave') {
        
            let keyPos = baddieGreenDemon.worldPos();

            // check on hp prevents that the number of demons only 
            // decreases by one ( death event can fire multiple times if the object does not disappear )

            if (baddieGreenDemon.hp() === 0 ) { 
                gameState.killBaddieGreenDemonInCave();
            }

            if (gameState.areAllBaddieGreenDemonsDead()) {
                const key = createKey(keyPos)
                key.moveTo(keyPos);
                key.onCollide('player', () => {
                    key.destroy();
                    gameState.playerObtainedKey();
                })
            }
        }

        k.wait(0.5, () => {
            baddieGreenDemon.destroy();
        })
    })

    baddieGreenDemon.on('hurt', ()=> {
        baddieGreenDemon.play('dead');
        baddieGreenDemon.fxPlay('hurt');
        baddieGreenDemon.use(k.shader('saturate', () => ({
            "u_time": k.time() % 0.30,
            "u_pos": k.vec2(0, 0),
            "u_size": k.vec2(100, 100),
        })))

        baddieGreenDemon.healthbarBackground.opacity = 1;
        baddieGreenDemon.healthbar.opacity = 1;
        baddieGreenDemon.healthbar.width = baddieGreenDemon.healthbar.width - 5; 
        baddieGreenDemon.patrolEvent.cancel();
        baddieGreenDemon.flash(1000);
        k.wait(0.2, () => {
            baddieGreenDemon.unuse('shader');
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

    
  
