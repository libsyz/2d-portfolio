
/*

option 1: work with random num, dirtier + faster
-----------------------------------------

- scene starts
- user selects a topic
- game captures topic number
- we use that topic number to get the questions that belong to that topic
- user selects a question
- game captures the topic number
- we use that question number to know if the answer was correct or not

The number that is chosen is passed back and forth from the game to the auxiliary methods,
and there is a loose relationship between them

Option 2: work with ids associated w/ structs/interfaces, slower but better style
---------------------------------------------------------------------------------

- scene starts
- user selects a topic
-- user selection method works with a struct to render
- game captures an identifier

Here the ids that are chosen can be stored in the gamestate safely, and be used to call 
methods that live within the scene 

I'm gonna go with quick and dirty. God forgive me 

*/

export const skillsCutsceneDialogueData =
[
    {
        topic: 'product', 
        questions: [
            { 
                id: 0,
                question: "What is cost of delay?" ,
                playerAnswers: 
                [
                    { 
                        id: 0,
                        content: "A method to prioritise features",
                        isCorrect: true
                    },
                    {
                        id: 1,
                        content: "A framework to optimize features",
                        isCorrect: false
                    },
                    {
                        id: 2, 
                        content: "An approach to generating debate with engineers",
                        isCorrect: false
                    }
                ]
            },
            { 
                id: 1,
                question: "What does AARRR stand for?" ,
                playerAnswers: 
                [
                    { 
                        id: 0,
                        content: "Acquisition, Activation, Retention, Referral, Revenue",
                        isCorrect: true
                    },
                    {
                        id: 1,
                        content: "Awareness, Activation, Recognition, Retargeting, Revenue",
                        isCorrect: false
                    },
                    {
                        id: 2, 
                        content: "I prefer GROG matey",
                        isCorrect: false
                    }
                ]
            },

        ]
    },
    {
        topic: 'AI', 
        questions: [
            { 
                id: 0,
                question: "What does RAG stand for?" ,
                playerAnswers: 
                [
                    { 
                        id: 0,
                        content: "Referential Automodelled Gibbons",
                        isCorrect: false
                    },
                    {
                        id: 1,
                        content: "Reticular Augmented Gamma",
                        isCorrect: false
                    },
                    {
                        id: 2, 
                        content: "Retrieval Augmented Generation",
                        isCorrect: true
                    }
                ]
            }
        ]
    },
    {
        topic: 'psychology', 
        questions: [
            { 
                id: 0,
                question: "Who is the father of experimental psychology" ,
                playerAnswers: 
                [
                    { 
                        id: 0,
                        content: "Thorndike",
                        isCorrect: false
                    },
                    {
                        id: 1,
                        content: "Skinner",
                        isCorrect: false
                    },
                    {
                        id: 2, 
                        content: "Bandura",
                        isCorrect: true
                    }
                ]
            }
        ]
    }
]