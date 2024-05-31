

export const createGameState = () => {
    return { 
        scrolls: [],
        updateScrolls(scroll) {
            this.scrolls.push(scroll);
        },
        checkFinished() {
            return this.scrolls.length === 3 ? true : false;
        }
    }
}
