import { k } from './kaboomCtx';

k.loadSprite('player', './src/assets/player.png', {
    sliceX: 4,
    sliceY: 6,
    anims: {
        'idle-down': 0,
        'idle-up': 4,
        'idle-left': 8,
        'idle-right': 12,
        'attack-down': 16,
        'attack-up': 17,
        'attack-left': 18,
        'attack-right': 19,
        'down': {from: 0, to: 3, loop: true, speed: 8 },
        'up': {from: 4, to: 7, loop: true, speed: 8 },
        'left': {from: 8, to: 11, loop: true, speed: 8},
        'right': {from: 12, to: 15, loop: true, speed: 8},
        'hurt': 24
    }
})

k.loadSprite('shuriken2', './src/assets/shuriken2.png', {
    sliceX: 2,
    sliceY: 1,
    anims: {
        throw: { from: 0, to: 1, loop: true, speed: 10 }
    }
})


const shurikenComp = () => {
    return {
        throwShuriken(){
            const SHURIKEN_SPEED = 800;
            let xOffset = 0;
            let yOffset = 0;
            
            if (this.direction === k.RIGHT) {
                xOffset = 32;
            } else if (this.direction === k.LEFT ) { 
                xOffset = -32
            } else if (this.direction === k.UP) {
                yOffset = -32
            } else {
                yOffset = 32
            }

            const shuriken = k.add([
                k.sprite('shuriken2', { anim: 'throw'}),  
                k.area(),
                k.pos( this.pos.x + xOffset , this.pos.y + yOffset ),
                k.anchor("center"),
                k.color(127, 127, 255),
                k.scale(2),
                k.move(this.direction, SHURIKEN_SPEED),
                k.offscreen({ destroy: true }),
                // strings here means a tag
                "shuriken",
            ])

            return shuriken
        }
    }
}

export const createPlayer = () => {
    const playerScale = 4;
    const playerAreaScale = {scale: k.vec2(0.3, 0.3)};
    const playerBaseSpeed = 340;
    
    const player = k.add([
        k.sprite('player'), 
        { direction: k.DOWN },
        k.pos(20, 20), 
        //scale constrains bounds to the right place :-)
        k.area(playerAreaScale),
        k.anchor('center'),
        k.scale(playerScale),
        k.body({mass: 1}),
        k.state('attack', ['attack', 'explore', 'dialogue'] ),
        shurikenComp(),
        { 
            moveEvents: [], 
            attackEvents: [],
            setPlayerAttackEvents() {
                this.attackEvents.push(
                    this.onKeyPress("space", () => {
                        let shuri = this.throwShuriken();

                        if (this.direction === k.DOWN) {
                            this.play('attack-down');
                        } else if ( this.direction === k.UP ) {
                            this.play('attack-up')
                        } else if ( this.direction === k.RIGHT) {
                            this.play('attack-right')
                        } else if ( this.direction === k.LEFT ) {
                            this.play('attack-left')
                        }
                    }),
                    k.onKeyRelease('space', () => {
                        if (player.direction === k.DOWN) {
                            player.play('idle-down');
                        } else if ( player.direction === k.UP ) {
                            player.play('idle-up')
                        } else if ( player.direction === k.RIGHT) {
                            player.play('idle-right')
                        } else if ( player.direction === k.LEFT ) {
                            player.play('idle-left')
                        }
                    })
                )
            },
            setPlayerMovementEvents() {
                this.moveEvents.push(
                        this.onKeyDown('right', () => {
                        this.move(playerBaseSpeed, 0);
                        if (this.curAnim().includes('idle')) {
                            this.direction = k.RIGHT;
                            this.play("right")
                        }
                    }),
                    
                    this.onKeyDown('left', () => {
                        this.move(-playerBaseSpeed, 0);
                        if (this.curAnim().includes('idle')) {
                            this.direction = k.LEFT;
                            this.play("left");
                        }
                    }),
                    
                    this.onKeyDown('down', () => {
                        this.move(0, playerBaseSpeed);
                        
                        if (this.curAnim().includes('idle')) {
                            this.direction = k.DOWN;
                            this.play("down");
                        }
                    }),
                    
                    this.onKeyDown('up', () => {
                        this.move(0, -playerBaseSpeed);
                        if (this.curAnim().includes('idle')) {
                            this.direction = k.UP;
                            this.play("up");
                        }
                    }),
                    
                    this.onKeyRelease('right', () => {
                        this.play('idle-right');
                    }),
                    
                    this.onKeyRelease('left', () => {
                        this.play('idle-left');
                    }),
                    
                    this.onKeyRelease('up', () => {
                        this.play('idle-up');
                    }),
                    
                    this.onKeyRelease('down', () => {
                        this.play('idle-down');
                    })
                )
            },
            clearAttackEvents() {
                if (this.attackEvents.length > 0) {
                    this.attackEvents.forEach((ev) => ev.cancel());          
                }
            },
            clearMovementEvents() {
                if (this.moveEvents.length > 0) {
                    this.moveEvents.forEach((ev) => ev.cancel());          
                }
            },
            goIdle() {
                if (this.direction === k.UP) {
                    this.play('idle-up')
                } else if (this.direction === k.DOWN ) {
                    this.play('idle-down');
                } else if (this.direction === k.LEFT ) {
                    this.play('idle-left');
                } else if (this.direction === k.RIGHT ) {
                    this.play('idle-right');
                } else {
                    this.play('idle-down');
                }
            }
        },
        'player'
    ]);


    player.onStateEnter('attack', () => {   
        player.setPlayerMovementEvents();
        player.setPlayerAttackEvents();
    })

    player.onStateEnter('explore', () => {
        player.clearAttackEvents();
        player.setPlayerMovementEvents();
        
    })

    player.onStateEnter('dialogue', () => {
        player.goIdle();
        player.clearAttackEvents();
        player.clearMovementEvents();
    })
    
    // init player in idle state
    player.play('idle-down')
    
    return player;
}

export const createOfficePlayer = () => {
    const playerScale = 4;
    const playerAreaScale = {scale: k.vec2(0.3, 0.3)};
    const playerBaseSpeed = 340;
    
    const player = k.add([
        k.sprite('player'), 
        k.pos(0, 0), 
        //scale constrains bounds to the right place :-)
        k.area(playerAreaScale),
        k.anchor('center'),
        k.scale(playerScale),
        k.body(),
        k.state('spawn', ['first', 'second', 'third', 'fourth', 'fifth']),
        'player'
    ]);
    
    // init player in idle state
    player.play('idle-down')
    
    return player;
}



