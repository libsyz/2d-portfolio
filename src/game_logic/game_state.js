

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
        scrolls: [],
        updateScrolls(scroll) {
            this.scrolls.push(scroll);
        },
        // Checks if the game is over when we have all 3 scrolls
        checkFinished() {
            return this.scrolls.length === 3 ? true : false;
        },
        baddieGreenDemonsInCave: 0,
        addBaddieGreenDemon() {
            this.baddieGreenDemonsInCave += 1;
        },
        killBaddieGreenDemon() {
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
