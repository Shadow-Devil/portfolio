export class Field {
    private inhalt: number;

    constructor (zahl: number = 0) {
        this.inhalt = zahl;
    }

    getContent (): number {
        return this.inhalt;
    }

    setInhalt (zahl: number) {
        this.inhalt = zahl;
    }

    reset () {
        this.inhalt = 0;
    }


    isConstant(): boolean{
        return false;
    }
}

export class FinalField extends Field {

    constructor(zahl: number) {
        super(zahl);
    }

    setInhalt(zahl: number) {
        // cant overwrite;
        console.error("Trying to Overwrite Constant Field");
    }

    isConstant() {
        return true;
    }


    reset() {

    }
}
