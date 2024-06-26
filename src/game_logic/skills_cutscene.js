import { k } from "./kaboomCtx.js";
import { showDialogueHouse } from "./utils";
import { userSelect } from "./utils";


export const createSkillsCutscene = () => { 

    return {
        sceneState: {
            topicSelection: null,
        },
        sceneCounter: 0,
        async init(map, player) {
            this.player = player;
            this.spawnSpirit(map);
            this.setup();
            this.next();
        },
        spiritDialogue() {
            let dialogue = showDialogueHouse('spirit-face', 
                [
                    'Hello seeker', 
                    'Answer my questions correctly to get your skills scrolls',
                    'Choose your topic wisely'
                ]);

            dialogue.onStateEnter('end', () => this.next() );
        },
         async spawnSpirit(map) {
            const spirit = await map.add([
                k.sprite('spirit'),
                k.scale(0.8),
                k.anchor('center'),
                k.pos(160, 60),
                k.fadeIn(1),
                k.opacity(1),
                'spirit'
            ])

            spirit.play('idle');
        },
        async getTopics() {
           const selectBox = await userSelect();

           await selectBox.onStateEnter('end', () => {
            this.sceneState.topicSelection = selectBox.getActiveContents();
           })

           return selectBox;

        },
        setup() {
            // context is bound so I reference the object, not the array
            this.parts = [ this.spiritDialogue.bind(this), this.getTopics.bind(this) ]
        },
        next: function() {
            this.parts[this.sceneCounter]();
            this.sceneCounter++
        }

            


    }
}