
// File keeps the creation of objects that are in the map and can be inspected are 'talked to' on collision

import { k } from './kaboomCtx';
import { fxComp } from './utils';
import { charDialogue } from './utils';
import sparkleGleamSoundUrl from './../audio/fx/sparkle-gleam.mp3';

k.loadSound('sparkle-gleam', sparkleGleamSoundUrl);

const objectDialogues = {
    'psychology_diploma': ['This is my psychology degree', 'I learned so much about humans here, but also thinking machines', 'Everyone says my work has nothing to do with psychology, but I think it does!'],
    'book_shelf': ['These are some of my favorite\nbooks!', 'There\'s psychology, computer\nscience, economics, phylosophy\nand some graphic novels', 'There is something special about\nreading on paper'],
    'globe': ['This globe has pins with the\nplaces we have been to', 'I have worked in 30+ countries,\nand lived in Europe, Asia and\nLatin America', 'Travelling really can be a cure for ignorance', 'Can\'t wait for the next\nadventure!'],
    'painting': ['A picture of Tarifa, Cadiz', 'You can see Africa across the\nsea', 'My dads family comes from here'],
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
