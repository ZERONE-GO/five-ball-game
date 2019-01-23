export default class History {

    constructor() {
        this.history = [];
    }

    push(state) {
        this.history.push(state);
    }

    pop() {
        return this.history.pop();
    }

}