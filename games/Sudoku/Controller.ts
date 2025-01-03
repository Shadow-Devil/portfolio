import Model from './model/Model.js';
import * as View from './view/view.js';
import {Difficulty} from './model/Types.js';

export class Controller {

    private gameRunning: boolean = false;
    private readonly help: boolean = true;

    private timer: number = 0;
    private startTime: number = 0;

    private readonly model: Model;
    private readonly sql: any;

    constructor() {
        this.model = new Model();
        View.init(this, this.model);
        //this.sql = new SQL();
    }

    public start(diff: Difficulty) {
        console.log("Start")
        this.model.start(diff);
        console.log("Finish");
        this.startTimer();
        View.showStartOverlay(false);
        View.updateSudoku(this);
    }

    load() {
        if (this.sql.isSudokuEmpty()) {
            //view.writeHelpLabel('Es wurde kein Spielstand gefunden');
            return;
        }

        this.model.load(this.sql.getSudoku());
        this.startTimer(this.sql.getSudokuTime());

        this.sql.clearSudoku();

        //view.start(this.model.getGameBoard());
    }

    save() {
        this.stopTimer();
        //view.showStartScreen();

        let sb = '';
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                sb += (this.model.getFieldContent(x, y));
                sb += (this.model.isFieldConstant(x, y) ? 't' : 'f');
            }
        }
        this.sql.save(sb, this.timer);
    }

    clearInput() {
        this.model.clearInput();
        View.updateSudoku(this);
        View.showPauseOverlay(false);
        this.startTimer();
    }

    clearBoard() {
        this.model.clearBoard();
        View.updateSudoku(this);
        View.showPauseOverlay(false);
        View.showStartOverlay(true);
        this.startTimer();
    }

    stopTimer() {
        if (this.startTime === 0)
            console.error('Timer isnt started!');

        this.gameRunning = false;
        this.timer += Date.now() - this.startTime;
        this.startTime = 0;
    }

    startTimer(initial: number = 0) {
        this.timer = initial;
        this.gameRunning = true;
        this.startTime = Date.now();
    }

    choseNumber(x: number, y: number, n: number) {
        this.model.setField(x, y, n);
        //view.choseNumber(n);
        if (this.help && !this.model.pruefeSpielzahl(x, y)) {


        }
        this.checkEnd();
    }

    checkEnd() {
        if (!this.gameRunning || !this.model.isFull()) {
            return;
        }

        if (this.model.isFinished()) {
            this.stopTimer();
            alert("YOU HAVE WON!" + this.timer);
            //view.showEndScreen(this.timer);
            return;
        }

        //the sudoku is full but isnt correct => highlight wrong fields
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                if (!this.model.pruefeSpielzahl(x, y) &&
                    !this.model.isFieldConstant(x, y)) {
                    //this.view.highlightBad(x, y);
                }
            }
        }
    }

    highscore() {
        //view.showHighscoreScreen(this.sql.getHighscores());
    }

    highscoreinsert() {
        //if (view.getNameInput() === '') {
        //view.writeHelpLabel('Bitte gebe einen Namen ein');
        //return;
        //}
        //view.setUsername(view.getNameInput());
        //this.sql.insertHighscore(view.getNameInput(), this.timer);
        //view.showStartScreen();
    }

    getTimer() {
        return this.timer;
    }

    getFieldContent(x: number, y: number) {
        return this.model.getFieldContent(x, y);
    }

    isFieldConstant(x, y) {
        return this.model.isFieldConstant(x, y);
    }
}

const controller = new Controller();


