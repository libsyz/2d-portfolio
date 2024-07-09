import { k } from './kaboomCtx.js'


const FRAMERATE = 60;

export const seconds = (secs) => {
    return FRAMERATE * secs
}

export const showDialogue = (faceTag, message) => {
    // ALL MAGIC NUMBERS
    // add the dialogue box
    const dialogueBox = k.add([
        k.sprite('dialogue_box_simple'),
        k.pos(8, 464),
        k.scale(4),
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
export const showDialogueHouse = (faceTag, messages) => {
    let currentMessageIdx = 0 

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

    dialogueBox.onKeyPress('space', () => {
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
            k.debug.log('hello world');
            dialogueBox.enterState('end');
            dialogueBox.destroy();
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


export const userSelect = (optionsArray) => {
    // TODO
    // implement a dialog box
    // With Arrows
    // Where the user can select topics 
    // and a choice is returned 

    const {x, y} = k.camPos();

    const selectBox = k.add([
        k.sprite('dialogue_box_simple'),
        k.pos(x - 632, y + 116),
        k.scale(4),
        k.state('start', ['end']),
        { 
            activeOption: 0,
            getActiveContents() {
                 return ( this.children.find((el) => el.active === true) ).contents
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
                el.active.true;
                el.color = new k.Color(0, 0, 255);
            } else {
                el.active = false;
                el.color = new k.Color(0, 0, 0);
            }
        })

    
    })

    selectBox.onKeyDown('enter', () => {
        selectBox.enterState('end');
        selectBox.destroy();
    })

    return selectBox;

}


