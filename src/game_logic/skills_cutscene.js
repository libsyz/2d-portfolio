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
            // this approach does not make sense, all the callbacks are going to run 

        },
        spiritDialogue() {
            let dialogue = showDialogueHouse('spirit-face', 
                [
                    'Hello seeker', 
                    'Answer my questions correctly to get your skills scrolls',
                    'Choose your topic wisely'
                ]);

            dialogue.onStateEnter('end', (this) => { this.next() } )
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
            this.parts = [ this.spiritDialogue, this.getTopics ]
        },
        next() {
            this.parts[this.sceneCounter]();
            this.sceneCounter++
        },

            


        }
    }