import { k } from "./kaboomCtx.js";
import { skillsCutsceneDialogueData } from "./skills_cutscene_dialogue.js";
import { showDialogueMultiple } from "./utils";
import { userSelect } from "./utils";




export const createSkillsCutscene = (gameState) => { 

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

            let dialogue = showDialogueMultiple(
                'spirit-face', 
                [
                    'Hello seeker', 
                    'Answer my questions correctly\nto get your skills scrolls',
                    'Choose your topic wisely'
                ], 
                'default-voice');

            k.trigger('play-dialogue', 'dialog-box');

            let advanceDialogue = k.onKeyRelease('space', () => {
                k.trigger('play-dialogue', 'dialog-box');
            })

            dialogue.onStateEnter('end', () => { 
                gameState.isDialogueBusy = true;
                advanceDialogue.cancel();
                this.next()
                k.wait(0.2, () => {
                    gameState.isDialogueBusy = false;
                })
            
            });
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
           gameState.isDialogueBusy = true;

           const topics = skillsCutsceneDialogueData.map(el => el.topic);

           const selectBox = userSelect(gameState, topics);

            selectBox.onStateEnter('end', async () => {
                this.sceneState.topicSelection = await selectBox.getActiveAnswerNumber();
                this.next();
                k.wait(0.2, () => {
                    gameState.isDialogueBusy = false;
                })
            })

           return selectBox;

        },
        spiritQuestions() {
            gameState.isDialogueBusy = true;
            const topicPos = this.sceneState.topicSelection;

            this.sceneState.questionSelection = Math.floor(Math.random() * 3);
            
            const question = () => {
                let qs = this.dialogueData[topicPos]['questions'].map(el => el.question );
                return qs[this.sceneState.questionSelection];
            }

            const dialogue = showDialogueMultiple(
                'spirit-face', 
                ['Let\'s see if you can answer\nthis...', question()],
                'default-voice'
            )

            k.trigger('play-dialogue', 'dialog-box');

            let advanceDialogue = k.onKeyRelease('space', () => {
                k.trigger('play-dialogue', 'dialog-box');
            })

            dialogue.onStateEnter('end', () => {
                this.next();
                advanceDialogue.cancel();
                k.wait(0.2, () => {
                    gameState.isDialogueBusy = false;
                })
            })
        },
        getAnswers() {
            gameState.isDialogueBusy = true; 
            const topicIndex = this.sceneState.topicSelection;
            const questionIndex = this.sceneState.questionSelection;
            const answers = skillsCutsceneDialogueData[topicIndex]['questions'][questionIndex]['playerAnswers'].map(el => el.content);

            const selectBox = userSelect(gameState, answers);
 
             selectBox.onStateEnter('end', async () => {
                this.sceneState.answerSelection = selectBox.getActiveAnswerNumber();
                this.next()
                k.wait(0.2, () => {
                    gameState.isDialogueBusy = false;
                })
             })
 
            return selectBox;
        },
        spiritEvaluate() {
            // TODO: This is so ugly
            gameState.isDialogueBusy = true;
            const evaluation = this.dialogueData[this.sceneState.topicSelection]['questions'][this.sceneState.questionSelection]['playerAnswers'][this.sceneState.answerSelection]
            let dialogue;


            if (evaluation.isCorrect ) {
                dialogue = showDialogueMultiple(
                    'spirit-face', 
                    ['You answer is correct!', 'You are worthy of the\nskills scroll'],
                    'default-voice'
                    )
            } else { 
                dialogue = showDialogueMultiple(
                    'spirit-face', 
                    [
                     'You answer is incorrect!', 
                     'But I will give you\nthe skills scroll anyway',
                     'Finding a job is already\nhard enough'
                    ],
                    'default-voice'
                )
            }

            k.trigger('play-dialogue', 'dialog-box');

            let advanceDialogue = k.onKeyRelease('space', () => {
                k.trigger('play-dialogue', 'dialog-box');
            })

            dialogue.onStateEnter('end', () => {    
                this.next();
                advanceDialogue.cancel();
                k.wait(0.2, () => { 
                    gameState.isDialogueBusy = false; 
                })
            } )

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
            // using bind to keep object as the context
            this.parts = [ 
                this.spiritDialogue.bind(this), 
                this.getTopics.bind(this),
                this.spiritQuestions.bind(this),
                this.getAnswers.bind(this),
                this.spiritEvaluate.bind(this),
                this.spawnSkillsScroll.bind(this)
            ]
        },
        next() {
            this.parts[this.sceneCounter]();
            this.sceneCounter++
        }
    }
}