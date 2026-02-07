
// File keeps the creation of objects that are in the map and can be inspected are 'talked to' on collision

import { k } from './kaboomCtx';
import { fxComp } from './utils';
import { charDialogue } from './utils';
import sparkleGleamSoundUrl from './../audio/fx/sparkle-gleam.mp3';

k.loadSound('sparkle-gleam', sparkleGleamSoundUrl);

const objectDialogues = {
    'psychology_diploma': [
        'My psychology degree.',
        'This is where I learned about thinking,\ndeciding, and changing.',
        'People say technology work has nothing to do with psychology.',
        'I couldn’t disagree more.'
    ],
    'book_shelf': [
        'Some of my favorite books.',
        'Psychology. Computer science.\nEconomics.',
        'A bit of philosophy.',
        'And yes… graphic novels.',
        'There’s something different\nabout reading on paper.',
        'It slows you down in a good way.'
    ],
    'globe': [
        'A globe marked with places\nI’ve worked. Over 30 countries.',
        'Lived across Europe, Asia,\nand Latin America.',
        'Travel teaches you quickly\nhow little you know.',
    ],
    'painting': [
        'A painting of the strait of\nGibraltar.',
        'On clear days, you can see\nAfrica across the sea.',
        'My dad’s family comes from here.',
        'I like remembering where\nthe journey started.'
    ]
}



const sparkleComp = (obj) => {
    const interactable = obj;
    return {
        sparkleAlreadyShown: false,
        setupSpark() {
            if (this.sparkleAlreadyShown) {
                return;
            }

            this.sparkleAlreadyShown = true;

            const sparkle = this.add([
                k.sprite('sparkle'),
                k.pos(this.area.shape.width / 2 , this.area.shape.height / 2),
                k.scale(0.40),
                k.anchor('center'),
                fxComp(),
                k.body({isStatic: true}),
                k.z(1000),
                { fxCollection: 
                    { gleam: 'sparkle-gleam'} 
                },
                'sparkle'
            ])
            sparkle.play('gleam');
            const gleamSound = sparkle.fxPlayLoop('gleam');
            
            
            k.wait(2, () => {
                sparkle.destroy();
                gleamSound.stop();
            })
        }
    }
}

export const createSparkleInteraction = (map, obj) => { 
    const interactable = map.add([
        k.area({
            shape: new k.Rect(k.vec2(0), obj.width, obj.height)
            }),
            k.body({isStatic: true}),
            k.pos(obj.x, obj.y),
            sparkleComp(obj),
            charDialogue(),
            k.z(9999),
            obj.name
            ])

            interactable.getFaceTag = () => { return 'player_face'; }
            interactable.getVoice = () => { return 'player-voice'; }
            interactable.getDialogueMessages = () => { return objectDialogues[obj.name]; }

    const interactableDetectionArea = interactable.add([
                k.rect(60, 60),
                k.pos(interactable.area.shape.width / 2 , interactable.area.shape.height / 2),
                k.area(),
                k.opacity(0),
                k.anchor('center'),
                `${obj.name}_detection_area`
            ])

    interactableDetectionArea.onCollide('player', () => {
        interactable.setupSpark();
    })

}

export const createInteraction = (map, obj) => { 
    const interactable = map.add([
        k.area({
            shape: new k.Rect(k.vec2(0), obj.width, obj.height)
            }),
            k.body({isStatic: true}),
            k.pos(obj.x, obj.y),
            obj.name
            ])
    // interactable.setup();
}
