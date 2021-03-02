import {Field} from "./Field";

export type Sudoku = Field[][];

export type Difficulty = {readonly min: number, readonly max: number};

class Dif {
    public readonly min: number;
    public readonly max: number;
    constructor (min, max) {
        this.min = min;
        this.max = max;
    }
}

export const EASY = new Dif(45, 51);
export const MEDIUM = new Dif(50, 56);
export const HARD = new Dif(55, 57);
export const EXTREME = new Dif(57, 68);
