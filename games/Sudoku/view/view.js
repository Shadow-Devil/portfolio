import { EASY, HARD, MEDIUM } from "../model/Types.js";
import { EMPTY } from "../model/Util.js";
const gameContainer = document.getElementById("gameContainer");
const startOverlay = document.getElementById("gameStartOverlay");
const pauseOverlay = document.getElementById("gamePauseOverlay");
export function init(controller, model) {
    buttonInit(controller);
    for (let x = 0; x < 9; x++) {
        gameContainer.appendChild(createSudokuRow(controller, model, x));
    }
}
function buttonInit(controller) {
    const startOverlayButtons = startOverlay.children;
    startOverlayButtons[1].addEventListener("click", () => controller.start(EASY), false);
    startOverlayButtons[2].addEventListener("click", () => controller.start(MEDIUM), false);
    startOverlayButtons[3].addEventListener("click", () => controller.start(HARD), false);
    const pauseOverlayButtons = pauseOverlay.children;
    pauseOverlayButtons[1].addEventListener("click", () => showPauseOverlay(false), false);
    pauseOverlayButtons[2].addEventListener("click", () => controller.clearInput(), false);
    pauseOverlayButtons[3].addEventListener("click", () => controller.clearBoard(), false);
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape' &&
            startOverlay.hidden &&
            pauseOverlay.hidden) {
            showPauseOverlay(true);
        }
    });
}
function createSudokuRow(controller, model, x) {
    const row = document.createElement("div");
    row.classList.add("sudokuColumn");
    for (let y = 0; y < 9; y++) {
        row.appendChild(createSudokuField(controller, model, x, y));
    }
    return row;
}
function createSudokuField(controller, model, x, y) {
    const field = document.createElement("div");
    field.classList.add("sudokuField");
    field.addEventListener("click", () => showInputNumbers(field, controller, x, y));
    const text = document.createTextNode(String(model.getFieldContent(x, y)));
    field.appendChild(text);
    return field;
}
export function showInputNumbers(field, controller, x, y) {
    if (controller.isFieldConstant(x, y))
        return;
    const input = prompt('Choose your number');
    if (input === null)
        return;
    const inputParsed = parseInt(input, 10);
    if (isNaN(inputParsed) || inputParsed < 1 || inputParsed > 9) {
        alert("Wrong input!");
        return;
    }
    controller.choseNumber(x, y, inputParsed);
    field.innerHTML = String(controller.getFieldContent(x, y));
}
export function showStartOverlay(show) {
    startOverlay.hidden = !show;
}
export function showPauseOverlay(show) {
    pauseOverlay.hidden = !show;
}
export function updateSudoku(controller) {
    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            const field = gameContainer.children[x].children[y];
            field.classList.remove("constant", "free");
            field.classList.add(controller.isFieldConstant(x, y) ? "constant" : "free");
            const content = controller.getFieldContent(x, y);
            field.innerHTML = content === EMPTY ? "\xa0" : String(content);
        }
    }
}
//# sourceMappingURL=view.js.map