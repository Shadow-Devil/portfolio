import { Field, FinalField } from "./Field.js";
import * as Util from "./Util.js";
export default class Model {
    /**
     * Erstelle ein leeres Sudokufeld
     * Füllen aller Felder mit 0
     */
    constructor() {
        this.gameBoard = Util.emptySudoku();
    }
    /**
     * Creates a Sudoku with the Types
     * @param diff Die Schwierigkeit
     */
    start(diff) {
        this.gameBoard = Util.produceGameBoard(diff);
    }
    load(s) {
        let i = 0;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const inhalt = parseInt(s.charAt(i++), 10);
                this.gameBoard[x][y] = s.charAt(i++) === 't' ?
                    new FinalField(inhalt) : new Field(inhalt);
            }
        }
    }
    isFinished() {
        return Util.isFinished(this.gameBoard);
    }
    isFull() {
        return Util.isFull(this.gameBoard);
    }
    isEmpty() {
        return Util.andBoard(this.gameBoard, field => field.getContent() === 0 || field.isConstant());
    }
    pruefeSpielzahl(x, y) {
        return Util.pruefeSpielzahl(this.gameBoard, x, y);
    }
    isFieldConstant(x, y) {
        return this.gameBoard[x][y].isConstant();
    }
    consumeBoard(c) {
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                c(x, y, this.gameBoard[x][y]);
            }
        }
    }
    clearInput() {
        this.consumeBoard((x, y, field) => field.reset());
    }
    clearBoard() {
        this.gameBoard = Util.emptySudoku();
    }
    setField(x, y, n) {
        this.gameBoard[x][y].setInhalt(n);
    }
    getFieldContent(x, y) {
        return this.gameBoard[x][y].getContent();
    }
    getGameBoard() {
        return this.gameBoard;
    }
}
//# sourceMappingURL=Model.js.map