import {Field} from "./Field.js";
import {Difficulty} from "./Types.js";

export const EMPTY  = 0;

/**
 * Generates a whole Number from 0 to max (exclusive)
 */
const randomInt = (max: number): number => Math.floor(Math.random() * max);

export const emptySudoku = (): Field[][] => Array.from(new Array(9), () => new Array<Field>(9).fill(new Field()));
const emptySudokuIntern = (): number[][] => Array.from(new Array(9), () => new Array<number>(9).fill(0));

const isInDiff = (diff: Difficulty, x: number) => x >= diff.min && x <= diff.max;
const copy = (board) => board.map((a) => a.slice());

export function produceGameBoard(diff: Difficulty): Field[][] {
    const fullBoard = produceFullBoard();
    let board = emptySudokuIntern();
    let deleted = 0;
    do {
        board = copy(fullBoard);
        deleted = 0;
        let x   = 0;
        let y   = 0;
        let tmp = 0;
        while (uniqueSolution(board)) {
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
function produceFullBoard(): number[][] {
    let result = emptySudokuIntern();
    while (!isFullIntern(result)) {
        result = ((input: number[][]) => {
                    for (let x = 0; x < 9; x++) {
                        for (let y = 0; y < 9; y++) {
                            const r = 1 + randomInt(9);
                            input[x][y] = r;

                            let runner = r;
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
        xtmp = Math.floor(x / 3) * 3;
        ytmp++;
    }
    return true;
}

export const uniqueSolution = (board: number[][]): boolean => solve(board, 0, 0) === 1;

function solve(board: number[][], x: number, y: number): number {
    let counter = 0;

    if (board[x][y] === EMPTY) {
        for (let i = 1; i <= 9; i++) {
            board[x][y] = i;
            if (canPlaceIntern(board, x, y))
                counter += selectNext(board, x, y);
        }
        board[x][y] = EMPTY;
    } else {
        return counter + selectNext(board, x, y);
    }
    return counter;
}

const selectNext = (board, x, y) => {
    if (x < 8) return solve(board, x + 1, y);
    if (y < 8) return solve(board, 0, y + 1);
    return 1;
}

/**
 * Prüft alle 81 Felder nach Regelverstoß
 */
export const isFinished = (board: Field[][]) => andBoard(board, (_, x, y) => pruefeSpielzahl(board, x, y));
export const isFull = (board: Field[][]) => andBoard(board, field => field.getContent() !== EMPTY);
const isFullIntern = (board: number[][]) => andBoard(board, field => field !== EMPTY);


/**
 * Creates A new Sudoku with every Field copied.
 */
export const internToObject =
    (from: number[][]) => from.map((column) =>
        column.map((field) =>
            Field.of(field)));

/**
 * Goes through the whole gameboard and checks if the Pradicate holds for every Field.
 *
 * @param board
 * @param p {Function} The Pradicate to check for
 * @return True if all Fields return true on the Pradicate else false.
 */
export const andBoard = <T>
    (board: T[][], p: (field: T, x: number, y: number) => boolean) =>
        board.every((column, x) =>
            column.every((field, y) =>
                p(field, x, y)));
