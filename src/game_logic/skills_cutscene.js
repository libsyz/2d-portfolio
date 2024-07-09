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

           const selectBox = userSelect(['hello', 'world']);

            selectBox.onStateEnter('end', async () => {
                this.sceneState.topicSelection = await selectBox.getActiveContents();
                this.next();
            })

           return selectBox;

        },
        spiritQuestions() {
            const topic = this.sceneState.topicSelection;

            

            const getRandomNumber = () => {
                return Math.floor(Math.random() * 3);
            }

            const dialogue = showDialogueHouse('spirit-face', 
                ['hahaha', this.dialogueData[0]['questions'].map(el => el.question )]
            )

            dialogue.onStateEnter('end', () => {
                this.next();
            })
        },
        getAnswers() {
            k.debug.log('should show the relevant answers in a dialogue')
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