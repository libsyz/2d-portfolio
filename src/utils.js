import { k } from './kaboomCtx.js'

export const showDialogue = (faceTag, message) => {

    // add the dialogue box
    const dialogueBox = k.add([
        k.sprite('dialogue_box_simple'),
        k.pos(8, 400),
        k.scale(1.5),
        'dialog'
    ]);

    dialogueBox.add([
        k.sprite(faceTag), 
        k.pos(12, 12),
        k.scale(1)
    ])

    dialogueBox.add([
        k.text(
            'Go through the gate to find the missing pieces of Miguels CV', { 
            size: 12, width: 256
        }),
        k.pos(56, 12),
        k.color(0,0,0)
    ])
}


