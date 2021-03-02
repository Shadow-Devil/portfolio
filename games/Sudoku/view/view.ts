import Model from "../model/Model.js";
import {Controller} from "../Controller.js";
import {EASY, HARD, MEDIUM} from "../model/Types.js";

export function viewInit(controller: Controller, model: Model){
	const overlayChildren = document.getElementById("gameOverlay").children;
	overlayChildren[1].addEventListener("mousedown", () => controller.start(EASY));
	overlayChildren[2].addEventListener("mousedown", () => controller.start(MEDIUM));
	overlayChildren[3].addEventListener("mousedown", () => controller.start(HARD));


	const gameContainer = document.getElementById("gameContainer");

	for (let y = 0; y < 9; y++) {
		gameContainer.appendChild(createSudokuRow(controller, model, y));
	}
}

function createSudokuRow(controller: Controller, model: Model, y: number){
	const row = document.createElement("div");
	row.classList.add("sudokuRow");
	for (let x = 0; x < 9; x++) {
		row.appendChild(createSudokuField(controller, model, x, y));
	}
	return row;
}

function createSudokuField(controller: Controller, model: Model, x: number, y: number){
	const field = document.createElement("div");
	field.classList.add("sudokuField");
	field.addEventListener("mousedown", () => showInputNumbers(controller, x, y));

	const text = document.createTextNode(String(model.getFieldContent(x, y)));
	field.appendChild(text);

	return field;
}

export function showInputNumbers(controller, x, y){


}

export function viewShowOverlay(show: boolean) {
	document.getElementById("gameOverlay").hidden = !show;
}

export function viewUpdate(model) {
	const gameContainer = document.getElementById("gameContainer");

	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			gameContainer.children[x].children[y].innerHTML = model.getFieldContent(x, y);
		}
	}
}
