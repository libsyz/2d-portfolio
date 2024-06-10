

export const createGameState = () => {
    return {
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
        checkFinished() {
            return this.scrolls.length === 3 ? true : false;
        }
    }
}
