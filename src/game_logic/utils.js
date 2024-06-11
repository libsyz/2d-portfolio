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


export const charDialogue = () => {
    return { 
        dialogShow() {
            this.dialogBubble = this.add([
                k.sprite('dialogue_info'),
                k.pos(2, -12),
                k.scale(0.75)
                ])

            this.dialogBubble.play('show');
            },
        dialogHide() {
            this.dialogBubble.destroy();
        } 
    }
}




