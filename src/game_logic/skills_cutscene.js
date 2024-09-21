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
            this.map = map;
            this.spawnSpirit();
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
         async spawnSpirit() {
            this.spirit = await this.map.add([
                k.sprite('spirit'),
                k.scale(0.8),
                k.anchor('center'),
                k.pos(160, 60),
                k.fadeIn(1), // todo - fadeIn deprecated
                k.opacity(1),
                {
                    customFadeOut(t) {
                        k.tween( 1, 0, 0.5, (v) => this.opacity = v, k.easings.linear);
                    }
                },
                'spirit'
            ])

            this.spirit.play('idle');
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
            const topicIndex = this.sceneState.topicSelection;
            const questionIndex = this.sceneState.questionSelection;
            const answers = skillsCutsceneDialogueData[topicIndex]['questions'][questionIndex]['playerAnswers'].map(el => el.content);

            const selectBox = userSelect(answers);
 
             selectBox.onStateEnter('end', async () => {
                this.sceneState.answerSelection = selectBox.getActiveAnswerNumber();
                this.next()
             })
 
            return selectBox;
        },
        spiritEvaluate() {
            // TODO: This is so ugly
            const evaluation = this.dialogueData[this.sceneState.topicSelection]['questions'][this.sceneState.questionSelection]['playerAnswers'][this.sceneState.answerSelection]
            let dialogue;
            
            if (evaluation.isCorrect ) {
                dialogue = showDialogueHouse('spirit-face', 
                    ['You answer is correct!', 'You are worthy of the skills scroll']
                )
            } else { 
                dialogue = showDialogueHouse('spirit-face', 
                    [
                     'You answer is incorrect!', 
                     'But I will give you the skills scroll anyway',
                     'Finding a job is already hard enough'
                    ]
                )
            }

            dialogue.onStateEnter('end', () => this.next());

            // check if its true or not
            // if true
            //      - Congratulate the user
            // if false 
            //      - Tell the user they were wrong

            // Proceed to show the scroll of skills 

        },
        spawnSkillsScroll() {
            // ghost needs to fade away
            // skills scroll needs to come in 
            this.map.add([
                k.sprite('skills_scroll'),
                k.scale(1),
                k.area(),
                k.anchor('center'),
                k.pos(140, 110),
                k.fadeIn(1),
                k.opacity(1),
                'skills_scroll'
            ])

            k.wait(0.5, () => {
                this.player.enterState('explore');
                this.spirit.customFadeOut(0.5);
            })

            k.wait(1, () => this.spirit.destroy());
        },
        setup() {
            // using bind to reference original context, not array
            this.parts = [ 
                this.spiritDialogue.bind(this), 
                this.getTopics.bind(this),
                this.spiritQuestions.bind(this),
                this.getAnswers.bind(this),
                this.spiritEvaluate.bind(this),
                this.spawnSkillsScroll.bind(this)
            ]
        },
        next: function() {
            this.parts[this.sceneCounter]();
            this.sceneCounter++
        }

            


    }
}