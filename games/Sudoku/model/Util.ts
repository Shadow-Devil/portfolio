import {Field, FinalField} from "./Field.js";
import {Difficulty, Sudoku} from "./Types.js";

const EMPTY  = 0;

/**
 * Generates a whole Number from 0 to max (exclusive)
 */
const randomInt = (max: number): number => Math.floor(Math.random() * max);

export const emptySudoku = (): Field[][] => Array.from(new Array(9), () => new Array<Field>(9));


const emptySudokuIntern = (): number[][] =>  Array.from(new Array(9), () => new Array<number>(9));


const isInDiff = (diff: Difficulty, x: number) => x >= diff.min && x <= diff.max;

export function produceGameBoard(diff: Difficulty): Sudoku {
    const fullBoard = produceFullBoard();
    let deleted: number;
    let board: number[][];
    do {
        board = fullBoard.slice();
        deleted = 0;
        let x   = 0;
        let y   = 0;
        let tmp = 0;
        while (uniqueSolution(board) === 1) {
            x = randomInt(9);
            y = randomInt(9);
            tmp = board[x][y];
            if (tmp !== EMPTY) {
                board[x][y] = EMPTY;
                deleted++;
            }
        }
        board[x][y] = tmp;
    } while (!isInDiff(diff, deleted));

    return internToObject(board);
}

/**
 * Zufälliges Füllen mit Abfrage nach Regelverstoß
 */
function produceFullBoard() {
    let result = emptySudokuIntern();
    while (!isFullIntern(result)) {
        result = ((input: number[][]) => {
                    for (let x = 0; x < 9; x++) {
                        for (let y = 0; y < 9; y++) {
                            const r = 1 + randomInt(9);
                            let runner = r;
                            input[x][y] = r;
                            while (!canPlaceIntern(input, x, y)) {
                                runner = (runner % 9) + 1;
                                input[x][y] = runner;

                                // Spielfeld kann nicht gefüllt werden
                                if (r === runner) {
                                    return emptySudokuIntern();
                                }
                            }
                        }
                    }
                    return input;
                })(result);
    }
    return result;
}



/**
 * Prüft eine Zahl nach Regelverstoß
 */
export function pruefeSpielzahl(board: Field[][], x: number, y: number) {
    const current = board[x][y].getContent();

    // testen, ob Feld beschrieben
    if (current === EMPTY)
        return false;

    // Zeilen und Spalten prüfen
    for (let i = 0; i < 9; i++) {

        // Zeilenabfrage
        if (current === board[i][y].getContent() && x !== i)
            return false;

        // Spaltenabfrage
        if (current === board[x][i].getContent() && y !== i)
            return false;

    }
    let xtmp = Math.floor(x / 3) * 3; // Welches 3x3
    let ytmp = Math.floor(y / 3) * 3;
    const xmax = xtmp + 3;
    const ymax = ytmp + 3;
    while (ytmp < ymax)// im 3x3 Quadrat Regelverstoß
    {
        while (xtmp < xmax) {
            if (current === board[xtmp][ytmp].getContent() && x !== xtmp && y !== ytmp)
                return false;
            xtmp++;
        }
        xtmp = x / 3 * 3;
        ytmp++;
    }
    return true;
}

function canPlaceIntern(board: number[][], x: number, y: number): boolean {
    const current = board[x][y];

    // testen, ob Feld beschrieben
    if (current === EMPTY)
        return false;

    // Zeilen und Spalten prüfen
    for (let i = 0; i < 9; i++) {

        // Zeilenabfrage
        if (current === board[i][y] && x !== i)
            return false;

        // Spaltenabfrage
        if (current === board[x][i] && y !== i)
            return false;

    }
    let xtmp = Math.floor(x / 3) * 3; // Welches 3x3
    let ytmp = Math.floor(y / 3) * 3;
    const xmax = xtmp + 3;
    const ymax = ytmp + 3;
    while (ytmp < ymax)// im 3x3 Quadrat Regelverstoß
    {
        while (xtmp < xmax) {
            if (current === board[xtmp][ytmp] && x !== xtmp && y !== ytmp)
                return false;
            xtmp++;
        }
        xtmp = x / 3 * 3;
        ytmp++;
    }
    return true;
}

export const uniqueSolution = (board: number[][]): number => solve(0, 0, board);

function solve(x: number, y: number, board: number[][]): number {
    let counter = 0;

    if (board[x][y] === EMPTY) {
        for (let i = 1; i <= 9; i++) {
            board[x][y] = i;
            if (canPlaceIntern(board, x, y)) {
                if (x < 8) {
                    counter += solve(x + 1, y, board);
                } else if (y < 8) {
                    counter += solve(0, y + 1, board);
                } else {
                    return 1;
                }
            }
        }
        board[x][y] = EMPTY;
    } else {
        if (x < 8) {
            counter += solve(x + 1, y, board);
        } else if (y < 8) {
            counter += solve(0, y + 1, board);
        } else {
            return 1;
        }
    }
    return counter;
}

/**
 * Prüft alle 81 Felder nach Regelverstoß
 */
export function isFinished(board: Sudoku): boolean {
    for (let y = 0; y < 9; y++) {
        for (let x = 0; x < 9; x++) {
            if (!pruefeSpielzahl(board, x, y)) {
                return false;
            }
        }
    }
    return true;
}


export const isFull = (board: Sudoku): boolean => andBoard(board, field => field.getContent() !== EMPTY);
const isFullIntern = (board: number[][]): boolean => andBoardIntern(board, field => field !== EMPTY);

export function setEmpty(board: Sudoku): Sudoku {
    for (const row of board)
        for (let y = 0; y < board[0].length; y++)
            row[y] = new Field();


    return board;
}

/**
 * Creates A new Sudoku with every Field copied.
 */
function internToObject(from: number[][]): Field[][] {
    const to = emptySudoku();
    for (let x = 0; x < from.length; x++)
        for (let y = 0; y < from[0].length; y++)
            to[x][y] = from[x][y] === EMPTY ? new Field(from[x][y]) : new FinalField(from[x][y]);
    return to;
}

/**
 * Goes through the whole gameboard and checks if the Pradicate holds for every Field.
 *
 * @param board {[[Field]]}
 * @param p {Function} The Pradicate to check for
 * @return True if all Fields return true on the Pradicate else false.
 */
export function andBoard(board: Sudoku, p: (field: Field) => boolean) {
    for (const column of board)
        for (const field of column)
            if (!p(field))
                return false;
    return true;
}

function andBoardIntern(board: number[][], p: (field: number) => boolean) {
    for (const column of board)
        for (const field of column)
            if (!p(field))
                return false;
    return true;
}
