import { k } from "./kaboomCtx.js";
import { skillsCutsceneDialogueData } from "./skills_cutscene_dialogue.js";
import { showDialogueHouse } from "./utils";
import { userSelect } from "./utils";


export const createSkillsCutscene = () => { 

    return {
        dialogueData: skillsCutsceneDialogueData,
        sceneState: {
            topicSelection: null,
            questionSelection: null, 
            answerSelection: null
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
           const topics = skillsCutsceneDialogueData.map(el => el.topic);

           const selectBox = userSelect(topics);

            selectBox.onStateEnter('end', async () => {
                this.sceneState.topicSelection = await selectBox.getActiveAnswerNumber();
                this.next();
            })

           return selectBox;

        },
        spiritQuestions() {
            const topicPos = this.sceneState.topicSelection;

            this.sceneState.questionSelection = Math.floor(Math.random() * 3);
            
            const question = () => {
                let qs = this.dialogueData[topicPos]['questions'].map(el => el.question );
                return qs[this.sceneState.questionSelection];
            }

            const dialogue = showDialogueHouse('spirit-face', 
                ['Let\'s see if you can answer this...', question()]
            )

            dialogue.onStateEnter('end', () => {
                this.next();
            })
        },
        getAnswers() {
            // hardcoded
            const answers = skillsCutsceneDialogueData[0]['questions'][0]['playerAnswers'].map(el => el.content);

            const selectBox = userSelect(answers);
 
             selectBox.onStateEnter('end', async () => {
                 k.debug.log('answer chosen, need to validate');
             })
 
            return selectBox;
        },
        setup() {
            // using bind to reference original context, not array
            this.parts = [ 
                this.spiritDialogue.bind(this), 
                this.getTopics.bind(this),
                this.spiritQuestions.bind(this),
                this.getAnswers.bind(this)
            ]
        },
        next: function() {
            this.parts[this.sceneCounter]();
            this.sceneCounter++
        }

            


    }
}