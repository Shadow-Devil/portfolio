import {Field, FinalField} from "./Field.js";
import {Difficulty, Sudoku} from "./Types.js";

const EMPTY  = 0;

/**
 * Generates a whole Number from 0 to max (exclusive)
 */
const randomInt = (max: number): number => Math.floor(Math.random() * max);

export const emptySudoku = (): Sudoku => {
    return Array.from(new Array(9), () => new Array(9));
}

const isInDiff = (diff: Difficulty, x: number) => x >= diff.min && x <= diff.max;

export function produceGameBoard(diff: Difficulty) {
    const fullBoard = produceFullBoard();
    let deleted;
    let board;
    do {
        board = copy(fullBoard);
        deleted = 0;
        let x   = 0;
        let y   = 0;
        let tmp = 0;
        while (uniqueSolution(board) === 1) {
            x = randomInt(9);
            y = randomInt(9);
            tmp = board[x][y].getContent();
            if (tmp !== EMPTY) {
                board[x][y].setInhalt(EMPTY);
                deleted++;
            }
        }
        board[x][y].setInhalt(tmp);
    } while (!isInDiff(diff, deleted));

    for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[0].length; y++) {
            if (board[x][y].getContent() !== 0)
                board[x][y] = new FinalField(board[x][y].getContent());
        }
    }

    return board;
}

/**
 * Zufälliges Füllen mit Abfrage nach Regelverstoß
 */
function produceFullBoard() {
    let result = setEmpty(emptySudoku());
    while (!isFull(result)) {
        result = ((input: Sudoku) => {
            for (let x = 0; x < 9; x++) {
                for (let y = 0; y < 9; y++) {
                    const r = 1 + randomInt(9);
                    let runner = r;
                    input[x][y].setInhalt(r);
                    while (!pruefeSpielzahl(input, x, y)) {
                        runner = (runner % 9) + 1;
                        input[x][y].setInhalt(runner);

                        // Spielfeld kann nicht gefüllt werden
                        if (r === runner) {
                            return setEmpty(input);
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
export function pruefeSpielzahl(board: Sudoku, x: number, y: number) {
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

export const uniqueSolution = (board: Sudoku): number => solve(0, 0, board);

function solve(x: number, y: number, tmpfeld: Sudoku): number {
    let counter = 0;

    if (tmpfeld[x][y].getContent() === EMPTY) {
        for (let i = 1; i <= 9; i++) {
            tmpfeld[x][y].setInhalt(i);
            if (pruefeSpielzahl(tmpfeld, x, y)) {
                if (x < 8) {
                    counter = counter + solve(x + 1, y, tmpfeld);
                } else if (y < 8) {
                    counter = counter + solve(0, y + 1, tmpfeld);
                } else {
                    return 1;
                }
            }
        }
        tmpfeld[x][y].setInhalt(EMPTY);
    } else {
        if (x < 8) {
            counter = counter + solve(x + 1, y, tmpfeld);
        } else if (y < 8) {
            counter = counter + solve(0, y + 1, tmpfeld);
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


export function setEmpty(board: Sudoku): Sudoku {
    for (const row of board)
        for (let y = 0; y < board[0].length; y++)
            row[y] = new Field();


    return board;
}

/**
 * Creates A new Sudoku with every Field copied.
 */
function copy(from: Field[][]): Field[][] {
    const to = emptySudoku();
    for (let x = 0; x < from.length; x++)
        for (let y = 0; y < from[0].length; y++)
            to[x][y] = new Field(from[x][y].getContent());
    return to;
}

function ausgeben(f: Sudoku) // Ausgeben des Gesamten Feldes
{
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            console.log(f[j][i].getContent() + " ");

        }
        console.log("\n");
    }
}

function ausgebenkonstant(f: Sudoku) // Ausgeben des Gesamten Feldes
{
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            console.log(f[j][i].isConstant() + "\t");
        }
        console.log();
    }
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
