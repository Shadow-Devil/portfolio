import { EMPTY } from "./Util.js";
export class Field {
    constructor(x = 0) {
        this.content = x;
    }
    getContent() {
        return this.content;
    }
    setInhalt(x) {
        this.content = x;
    }
    reset() {
        this.content = 0;
    }
    isConstant() {
        return false;
    }
    static of(x) {
        return x === EMPTY ? new Field(x) : new FinalField(x);
    }
}
export class FinalField extends Field {
    constructor(x) {
        super(x);
    }
    setInhalt(x) {
        // cant overwrite;
        console.error("Trying to Overwrite Constant Field");
    }
    isConstant() {
        return true;
    }
    reset() { }
}
//# sourceMappingURL=Field.js.map