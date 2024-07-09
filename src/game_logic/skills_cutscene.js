import { k } from "./kaboomCtx.js";
import { showDialogueHouse } from "./utils";
import { userSelect } from "./utils";


export const createSkillsCutscene = () => { 

    return {
        topics: ['product', 'ai', 'psychology'],
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
           const selectBox = await userSelect(this.topics);

        selectBox.onStateEnter('end', async () => {
            this.sceneState.topicSelection = await selectBox.getActiveContents();
            this.next();
           })

           return selectBox;

        },
        spiritQuestions() {
            const topic = this.sceneState.topicSelection;

            const questions = {
                product: [
                    'What is cost of delay?',
                    'What does ICE stand for?',
                    'Do you need to be technical to be a good PM?',
                ],
                ai: [
                    'What does RAG mean?', 
                    'What is more expensive, inference or training?',
                    'Can a LLM perform a task?'
                ],
                psychology: [
                    'Whats the dugi buru effect?', 
                    'What percentage of our brain do we usually use?',
                    'Who is the father of experimental psychology?'
                ]
            }

            const getRandomNumber = () => {
                return Math.floor(Math.random() * 3);
            }

            showDialogueHouse('spirit-face', 
                ['hahaha', questions[topic][getRandomNumber()]]
            )
        },
        setup() {
            // using bind to reference original context, not array
            this.parts = [ 
                this.spiritDialogue.bind(this), 
                this.getTopics.bind(this),
                this.spiritQuestions.bind(this)
            ]
        },
        next: function() {
            this.parts[this.sceneCounter]();
            this.sceneCounter++
        }

            


    }
}