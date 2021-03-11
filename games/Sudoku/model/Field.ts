import {EMPTY} from "./Util.js";

export class Field {
    private content: number;

    constructor (x: number = 0) {
        this.content = x;
    }

    getContent (): number {
        return this.content;
    }

    setInhalt (x: number) {
        this.content = x;
    }

    reset () {
        this.content = 0;
    }

    isConstant(): boolean{
        return false;
    }

    static of(x: number){
        return x === EMPTY ? new Field(x) : new FinalField(x);
    }
}

export class FinalField extends Field {

    constructor(x: number) {
        super(x);
    }

    setInhalt(x: number) {
        // cant overwrite;
        console.error("Trying to Overwrite Constant Field");
    }

    isConstant() {
        return true;
    }


    reset() {}
}
