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



export const showDialogueHouse = (faceTag, message) => {
    const {x, y} = k.camPos();
    const dialogueBox = k.add([
        k.sprite('dialogue_box_simple'),
        k.pos(x - 632, y + 116),
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


