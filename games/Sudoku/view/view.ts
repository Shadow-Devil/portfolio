import Model from "../model/Model.js";
import {Controller} from "../Controller.js";
import {EASY, HARD, MEDIUM} from "../model/Types.js";

export function viewInit(controller: Controller, model: Model){
	const overlayChildren = document.getElementById("gameOverlay").children;
	overlayChildren[1].addEventListener("click", () => controller.start(EASY), false);
	overlayChildren[2].addEventListener("click", () => controller.start(MEDIUM), false);
	overlayChildren[3].addEventListener("click", () => controller.start(HARD), false);


	const gameContainer = document.getElementById("gameContainer");

	for (let x = 0; x < 9; x++) {
		gameContainer.appendChild(createSudokuRow(controller, model, x));
	}
}

function createSudokuRow(controller: Controller, model: Model, x: number){
	const row = document.createElement("div");
	row.classList.add("sudokuColumn");
	for (let y = 0; y < 9; y++) {
		row.appendChild(createSudokuField(controller, model, x, y));
	}
	return row;
}

function createSudokuField(controller: Controller, model: Model, x: number, y: number){
	const field = document.createElement("div");
	field.classList.add("sudokuField");
	field.addEventListener("click", () => showInputNumbers(field, controller, x, y));

	const text = document.createTextNode(String(model.getFieldContent(x, y)));
	field.appendChild(text);

	return field;
}

export function showInputNumbers(field: HTMLDivElement, controller: Controller, x, y){
	if (controller.isFieldConstant(x, y))
		return;

	const input: number = parseInt(prompt('Choose your number'), 10);

	if (isNaN(input) || input < 1 || input > 9){
		alert("Wrong input!");
		return;
	}

	controller.choseNumber(x, y, input);
	field.innerHTML = String(controller.getFieldContent(x, y));
}

export function viewShowOverlay(show: boolean) {
	document.getElementById("gameOverlay").hidden = !show;
}

export function viewUpdate(controller: Controller) {
	const gameContainer = document.getElementById("gameContainer");

	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			const field = gameContainer.children[x].children[y];
			field.classList.add(controller.isFieldConstant(x, y) ? "constant" : "free");

			field.innerHTML = String(controller.getFieldContent(x, y));
		}
	}
}
