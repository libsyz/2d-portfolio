

import { k } from './kaboomCtx.js'


const FRAMERATE = 60;

export const seconds = (secs) => {
    return FRAMERATE * secs
}

export const showDialogue = (faceTag, message, gameState) => {
    const scene = k.get('map')[0].get(gameState.currentScene)[0];
    
    
    // places the dialogue box above or below the player depending on their position
    let playerY = k.get('player')[0].worldPos().y;
    let dialogueBoxYOffSet = ( playerY < 1000 ) ? 120 : -360;

    const { x, y } = scene.worldPos();
    const dialogueBox = k.add([
        k.sprite('dialogue_box_simple'),
        k.pos(x - 636, y + dialogueBoxYOffSet), // semi-magical numbers
        k.scale(4),
        k.z(9999),
        'dialog'
    ]);

    dialogueBox.add([
        k.sprite(faceTag), 
        k.pos(12, 12),
        k.scale(1)
    ])

    dialogueBox.add([
        k.text(
            message, { 
            size: 12, width: 256
        }),
        k.pos(56, 12),
        k.color(0,0,0)
    ])
}


// TODO: This is just a shitty function call name, I need to rename this 
export const showDialogueMultiple = (gameState, faceTag, messages) => {

    let currentMessageIdx = 0;
    
    const {x, y} = k.camPos();

    const dialogueBox = k.add([
        k.sprite('dialogue_box_simple'),
        k.pos(x - 632, y + 116),
        k.scale(4),
        k.state('start', ['end']),
        'dialog'
    ]);

    dialogueBox.add([
        k.sprite(faceTag), 
        k.pos(12, 12),
        k.scale(1)
    ])

    let currentMessage = dialogueBox.add([
        k.text(
            messages[currentMessageIdx], { 
            size: 12, width: 256
        }),
        k.pos(56, 12),
        k.color(0,0,0)
    ])

    dialogueBox.onKeyRelease('space', () => {
        if ( gameState.isDialogueBusy === true ) { 
            return
        }

        if (currentMessageIdx + 1 < messages.length ) {
            currentMessage.destroy();
            currentMessageIdx++;
                currentMessage = dialogueBox.add([
                    k.text(
                        messages[currentMessageIdx], { 
                        size: 12, width: 256
                    }),
                    k.pos(56, 12),
                    k.color(0,0,0)
                ])
        } else {
            dialogueBox.enterState('end');
            dialogueBox.destroy();
            
        }
    })

    return dialogueBox;
}


export const showDialogueScrollAcquired = (gameState, faceTag, messages, gameEndSceneController) => {

    let currentMessageIdx = 0;
    
    const {x, y} = k.camPos();

    const dialogueBox = k.add([
        k.sprite('dialogue_box_simple'),
        k.pos(x - 632, y + 116),
        k.scale(4),
        k.state('start', ['end']),
        'dialog'
    ]);

    dialogueBox.add([
        k.sprite(faceTag), 
        k.pos(12, 12),
        k.scale(1)
    ])

    let currentMessage = dialogueBox.add([
        k.text(
            messages[currentMessageIdx], { 
            size: 12, width: 256
        }),
        k.pos(56, 12),
        k.color(0,0,0)
    ])

    const dialogueBoxEvent = dialogueBox.onKeyRelease('space', async () => {
        if ( gameState.isDialogueBusy === true ) { 
            return
        }
        if (currentMessageIdx + 1 < messages.length ) {
            currentMessage.destroy();
            currentMessageIdx++;
                currentMessage = dialogueBox.add([
                    k.text(
                        messages[currentMessageIdx], { 
                        size: 12, width: 256
                    }),
                    k.pos(56, 12),
                    k.color(0,0,0)
                ])
        } else {
            dialogueBox.enterState('end');
            dialogueBox.destroy();
            if ( gameState.checkFinished() ) { 
                await dialogueBoxEvent.cancel();
                gameEndSceneController.trigger('endgame');
            }
        }
    })

    return dialogueBox;
}

export const fadeInScene = () => { 
    const rectangleFade = k.add([
        k.rect(10000, 10000),
        k.pos(0, 0),
        k.color(0, 0, 0),
        k.z(999),
        k.opacity(1)
    ])

    k.tween( 1, 0, 0.4, (v) => rectangleFade.opacity = v, k.easings.linear);

    k.wait(0.4, () => {
        rectangleFade.destroy();
    })
}

// kaboom component to show dialogue bubble on top of character head 
export const charDialogue = () => {
    return {
        setDialogBubble() {
            let dialogActivationArea = this.add(
                [
                    k.pos(8, 8),
                    k.rect(40, 40),
                    k.area(),
                    k.opacity(0),
                    k.anchor('center')
                ])

            dialogActivationArea.onCollide('player', () => {
                this.dialogShow();
            })

            dialogActivationArea.onCollideEnd('player', () => {
                this.dialogHide();
            })
        },
        dialogShow() {
            this.dialogBubble = this.add([
                k.sprite('dialogue_info'),
                k.pos(2, -10),
                k.scale(0.75),
                k.opacity(1)
                ])

            this.dialogBubble.play('show');
            k.tween( this.dialogBubble.pos, k.vec2(this.dialogBubble.pos.x, this.dialogBubble.pos.y - 4), 0.5, (newPos) => this.dialogBubble.pos = newPos, k.easings.easeOutBack );

            },
        dialogHide() {
            this.dialogBubble.destroy();
        } 
    }
}
                                                                        
export const userSelect = (gameState, optionsArray) => {

    const {x, y} = k.camPos();

    const selectBox = k.add([
        k.sprite('dialogue_box_simple'),
        k.pos(x - 632, y + 116),
        k.scale(4),
        k.state('start', ['end']),
        { 
            activeOption: 0,
            getActiveAnswerNumber() {
                 return ( this.children.find((el) => el.active === true) ).position
            }
         },
        'select'
    ]);

    let yOffset = 15;
    let idx = 0;

    for (const option of optionsArray) { 
         selectBox.add([
            k.text(option, { size: 12 }),
            k.pos(20, yOffset),
            k.color(0,0,0), 
            { 
                active: idx === 0 ? true : false, 
                position: idx, 
                contents: option 
            },
            'option'
        ])
        yOffset += 10;
        idx += 1;
    }

    selectBox.children.forEach((el) => {
        if ( el.position === selectBox.activeOption ) {
            el.color = new k.Color(0, 0, 255);
        }
    })

    selectBox.onKeyRelease('down', () => {
        if ( selectBox.activeOption == 2 ) { 
            return 
        }

        selectBox.activeOption += 1

        selectBox.children.forEach((el) => {
            if ( el.position === selectBox.activeOption ) {
                el.active = true;
                el.color = new k.Color(0, 0, 255);
            } else { 
                el.active = false 
                el.color = new k.Color(0, 0, 0 )
            }
        })
    })

    selectBox.onKeyRelease('up', () => {
        if ( selectBox.activeOption == 0 ) {
            return 
        }

        selectBox.activeOption -= 1

        selectBox.children.forEach((el) => {
            if ( el.position == selectBox.activeOption ) {
                el.active = true;
                el.color = new k.Color(0, 0, 255);
            } else {
                el.active = false;
                el.color = new k.Color(0, 0, 0);
            }
        })    
    })

    selectBox.onKeyRelease('space', () => {
        if ( gameState.isDialogueBusy === true ) {
            return
        }

        selectBox.enterState('end');
        selectBox.destroy();
    })

    return selectBox;

}


export const createScroll = (scrollSpriteName, scrollObjectName, position ) => {
    const scrollObj = k.add([
        k.sprite(scrollSpriteName),
        k.pos(position.x + 16, position.y - 8),
        k.scale(3),
        k.anchor('center'),
        scrollObjectName
    ])

    return scrollObj;
}

export const fxComp = (fxObj) => { 
    // fxObj should be shaped like this 
    // { eventOne: soundOne, eventTwo: soundTwo  }
    return {
        add() {
            if (!this.fxCollection) { 
                throw new Error("Component needs host to have an Fx collection Object to mount successfully");
            }
        },
        fxPlay(event) {
            k.play(this.fxCollection[event]);
        }
    }
}


export const leftRightPatrol = (speed, distance) => {

    return {  
        patrolCounter: 0, 
        patrolDirection: 'right',
        patrolRight() {
            this.patrolDirection = 'right';
            this.move( speed, 0 );
            if (this.curAnim() !== 'walk-right') {
                this.play('walk-right');
            }
        },
        patrolLeft() {
            this.patrolDirection = 'left';
            this.move( -speed, 0 );
            if (this.curAnim() !== 'walk-left') {
                this.play('walk-left');
            }
        },
        
        patrol() {
            if (!this.landmarkX) {
                throw('Component requires landmarkX property to function');
            }

            this.patrolEv = this.onUpdate(()  => {
                    if ( this.pos.x >= ( this.landmarkX + distance ) ) {
                        this.patrolDirection = 'left'
                    }

                    if ( this.pos.x <= this.landmarkX) {
                        this.patrolDirection = 'right'
                    }

                    if (this.patrolDirection === 'right') {
                        this.patrolRight();
                    } else if (this.patrolDirection === 'left') {
                        this.patrolLeft();
                    }
            })
        }, 
        cancelPatrol() {
            this.patrolEv.cancel();
        }

    }
}