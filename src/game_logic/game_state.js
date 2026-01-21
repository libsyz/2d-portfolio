import { k } from "./kaboomCtx.js";


export const createGameState = () => {
    return {
        currentScene: 'scene_1', // Game starts at scene_1
        isDialogueBusy: false,
        tutorial: {
            done: false,
            isComplete() {
                return this.done
            }, 
            complete() {
                this.done = true
            }
        }, 
        scrolls: ['x'],
        updateScrolls(scroll) {
            // Check if the scroll is already in the array before adding it
            if (!this.scrolls.includes(scroll)) {
                this.scrolls.push(scroll);
            }
        },
        // Checks if the game is over when we have all 3 scrolls
        checkFinished() {
            return this.scrolls.length === 3 ? true : false; 
        },
        isBaddieGreenDemonInForestDead: false,
        baddieGreenDemonsInCave: 0,
        killBaddieGreenDemonInForest() {
            this.isBaddieGreenDemonInForestDead = true;
        },
        addBaddieGreenDemon() {
            this.baddieGreenDemonsInCave += 1;
        },
        killBaddieGreenDemonInCave() {
            this.baddieGreenDemonsInCave -= 1;
        },
        areAllBaddieGreenDemonsDead() {
            return this.baddieGreenDemonsInCave === 0;
        },
        playerHasKey: false,
        playerObtainedKey() {
            this.playerHasKey = true;
        }

    }
}
