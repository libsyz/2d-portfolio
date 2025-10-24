import { k } from './kaboomCtx';
import { fxComp } from './utils';
import { showDialogueMultiple } from './utils';

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
        'hurt': 20,
        'down': {from: 0, to: 3, loop: true, speed: 8 },
        'up': {from: 4, to: 7, loop: true, speed: 8 },
        'left': {from: 8, to: 11, loop: true, speed: 8},
        'right': {from: 12, to: 15, loop: true, speed: 8}
    }
})

k.loadSprite('shuriken2', './src/assets/shuriken2.png', {
    sliceX: 2,
    sliceY: 1,
    anims: {
        throw: { from: 0, to: 1, loop: true, speed: 10 }
    }
})


k.loadSound('player-shuriken-throw', './src/audio/fx/player-shuriken-throw.mp3');
k.loadSound('player-hurt', './src/audio/fx/player-hurt.mp3');
k.loadSound('player-key-obtained', './src/audio/fx/player-key-obtained.mp3');
k.loadSound('player-scroll-obtained', './src/audio/fx/player-scroll-obtained.mp3');

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

const dialogueComp = () => {
    return {
        playerShowDialogue(faceTag, messages, voice, playVoiceOnce = false) {
            this.clearDialogueEvents();

            let advanceDialogue = k.onKeyRelease('space', () => {
                k.trigger('play-dialogue', 'dialog-box');
            })

            const dialogueBox = showDialogueMultiple(faceTag, messages, voice, playVoiceOnce);
            dialogueBox.onStateEnter('end', () => {
                this.enterState('explore');
                advanceDialogue.cancel();
            })

            return dialogueBox;
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
        k.state('attack', ['attack', 'explore', 'dialogue', 'dialogue_chicken', 'cutscene', 'open_experience_chest'] ),
        shurikenComp(),
        dialogueComp(),
        k.z(10),
        fxComp(),
        { 
            fxCollection: {
                //event: audio name played
                attack: 'player-shuriken-throw',
                hurt: 'player-hurt',
                keyObtained: 'player-key-obtained',
                scrollObtained: 'player-scroll-obtained'
            },
            moveEvents: [], 
            attackEvents: [],
            dialogueEvent: null,
            add() {
                this.setPlayerMovementEvents()
            },
            setPlayerAttackEvents() {
                if (this.attackEvents.length > 0) {
                    return
                }

                this.attackEvents.push(
                    this.onKeyPress("space", () => {
                        this.throwShuriken();
                        this.fxPlay('attack');

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
                if (this.moveEvents.length > 0 ) {
                    return
                }

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
                    this.attackEvents = [];          
                }
            },
            clearMovementEvents() {
                if (this.moveEvents.length > 0) {
                    this.moveEvents.forEach((ev) => ev.cancel());          
                    this.moveEvents = [];
                }
            },
            clearDialogueEvents() {
                if (this.dialogueEvent) {
                    this.dialogueEvent.cancel();
                    this.dialogueEvent = null;
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
        player.clearDialogueEvents();
        player.setPlayerMovementEvents()
        player.setPlayerAttackEvents();
    })

    player.onStateEnter('explore', () => {
        player.clearDialogueEvents();
        player.setPlayerMovementEvents();
        player.clearAttackEvents();
    })

    player.onStateEnter('dialogue', (interactable) => {
        player.clearAttackEvents();
        player.dialogueEvent = player.onKeyRelease('space', () => {
            player.clearMovementEvents(); 
            player.goIdle();
            player.playerShowDialogue(
                interactable.getFaceTag(), 
                interactable.getDialogueMessages(),
                interactable.getVoice()
            );
        })  
    })

    player.onStateEnter('dialogue_chicken', (chicken) => {
        player.clearAttackEvents();
        player.dialogueEvent = player.onKeyRelease('space', () => {
            player.clearMovementEvents(); 
            player.goIdle();
            const [faceTag, messages, voice] = chicken.getDialogueAssets()
            player.playerShowDialogue(faceTag, messages, voice, true);
        })
    })

    player.onStateEnter('cutscene', (_) => {
        player.clearAttackEvents();
        player.clearMovementEvents();
        player.goIdle();
    })

    player.onStateEnter('open_experience_chest', (treasureChest, gameState) => {
        player.clearAttackEvents();
        if (!gameState.playerHasKey) {
            player.clearMovementEvents();
            player.goIdle();
            player.dialogueEvent = player.onKeyRelease('space', () => {
                player.playerShowDialogue(
                    'player_face', 
                    ['Seems like I need a key to open this...'],
                    'player-voice'
                );
            })
        } else {
            player.clearMovementEvents();
            player.goIdle();
            let openChestEvent = k.onKeyRelease('space', () => {
                treasureChest.play('open');
                // spawn the scroll at the center of the chest
                const experienceScroll = k.add([
                    k.sprite('experience_scroll'),
                    k.pos(treasureChest.worldPos()),
                    k.scale(3),
                    k.anchor('center'),
                    k.z(999),
                    'experience_scroll',
                ]);

                player.fxPlay('scrollObtained');
                k.tween(
                    experienceScroll.pos, 
                    k.vec2(experienceScroll.pos.x, experienceScroll.pos.y - 20),
                    1,
                    (posVal) => { experienceScroll.pos = posVal }   
                )

                openChestEvent.cancel();
                gameState.updateScrolls('experience');
                ui.getScroll('experience');

                showDialogueScrollAcquired(
                    gameState,
                    'player_face', 
                    [
                        'I found my experience scroll!', 
                        'I suddenly know jiu jitsu!'
                    ]
                );
            
            })
        }
    })

    player.onCollide('fireball', () => {
        player.play('hurt');
        player.fxPlay('hurt');
        player.clearAttackEvents();
        player.clearMovementEvents();
        k.wait(0.2, () => {
            player.setPlayerAttackEvents();
            player.setPlayerMovementEvents();
            player.goIdle();
        })
    })

    player.onCollide('key', () => {
        player.fxPlay('keyObtained');
    })
    
    // init player in idle state
    player.play('idle-down')
    
    return player;
}

export const createOfficePlayer = () => {
    const playerScale = 4;
    const playerAreaScale = {scale: k.vec2(0.3, 0.3)};
    
    const player = k.add([
        k.sprite('player'), 
        k.pos(0, 0), 
        //scale constrains bounds to the right place :-)
        k.area(playerAreaScale),
        k.anchor('center'),
        k.scale(playerScale),
        k.body(),
        k.opacity(1),
        k.state('spawn', ['start', 'first', 'second', 'third', 'fourth', 'fifth']),
        'player'
    ]);
    
    // init player in idle state
    player.play('idle-down')
    
    return player;
}



