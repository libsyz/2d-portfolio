import { k } from "./kaboomCtx.js";
import { showDialogueHouse } from "./utils";
import { userSelect } from "./utils";


export const createSkillsCutscene = () => { 

    return {
        sceneState: {
            topicSelection: null,
        },
        async init(map, player) {
            this.player = player;
            this.spawnSpirit(map);
            let spiritDialogue = this.spiritDialogue();
            let topicsBox; 
            await spiritDialogue.onStateEnter('end', () => topicsBox = this.getTopics() );
            await topicsBox.onStateEnter('end', () => { 
                k.debug.log('this.sceneState.topicSelection')
            })

        },
        spiritDialogue() {
            return showDialogueHouse('spirit-face', 
                [
                    'Hello seeker', 
                    'Answer my questions correctly to get your skills scrolls',
                    'Choose your topic wisely'
                ]);
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

        }

            


        }
    }