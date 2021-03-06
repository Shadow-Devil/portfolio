import {Field, FinalField} from "./Field.js";
import {Sudoku} from "./Types.js";
import * as Util from "./Util.js";

export default class Model {

    private gameBoard: Sudoku;

    /**
     * Erstelle ein leeres Sudokufeld
     * Füllen aller Felder mit 0
     */
    constructor() {
        this.gameBoard = Util.setEmpty(Util.emptySudoku());
    }

    /**
     * Creates a Sudoku with the Types
     * @param diff Die Schwierigkeit
     */
    start(diff) {
        this.gameBoard = Util.produceGameBoard(diff);
    }

    load(s: string) {
        let i = 0;
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                const inhalt = parseInt(s.charAt(i++), 10);
                this.gameBoard[x][y] = s.charAt(i++) === 't' ?
                    new FinalField(inhalt) : new Field(inhalt);
            }
        }
    }

    isFinished(): boolean {
        return Util.isFinished(this.gameBoard);
    }

    isFull(): boolean {
        return Util.isFull(this.gameBoard);
    }

    isEmpty(): boolean {
        return Util.andBoard(this.gameBoard, field => field.getContent() === 0 || field.isConstant());
    }

    pruefeSpielzahl(x: number, y: number): boolean {
        return Util.pruefeSpielzahl(this.gameBoard, x, y);
    }


    isFieldConstant(x: number, y: number): boolean {
        return this.gameBoard[x][y].isConstant();
    }

    consumeBoard(c: { (x: number, y: number, field: Field) }) {
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                c(x, y, this.gameBoard[x][y]);
            }
        }
    }

    reset() {
        this.consumeBoard((x, y, field) => field.reset());
    }

    setField(x: number, y: number, n: number) {
        this.gameBoard[x][y].setInhalt(n);
    }


    getFieldContent(x: number, y: number) {
        return this.gameBoard[x][y].getContent();
    }

    getGameBoard() {
        return this.gameBoard;
    }
}
