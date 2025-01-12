import { createMazeState, resetMazeState,
	initMazeDFS, generateMazeStepDFS, generateMazeDFS,
	initMazePrim, generateMazeStepPrim, generateMazePrim,
	initMazeWilson, generateMazeStepWilson, generateMazeWilson
} from "./maze-generate.js";
import { createSolveState, resetSolveState, solveMazeDFS } from "./maze-solve.js";
import { resizeCanvas, drawMaze } from "./maze-render.js";

// DOM
const canvas = document.getElementById("maze");
const generateButton = document.getElementById("generate-button");
const generatePlayButton = document.getElementById("generate-play-button");
const generateStepButton = document.getElementById("generate-step-button");
const generateResetButton = document.getElementById("generate-reset-button");
const solveButton = document.getElementById("solve-button");
const solvePlayButton = document.getElementById("solve-play-button");
const solveStepButton = document.getElementById("solve-step-button");
const solveResetButton = document.getElementById("solve-reset-button");
const generateSelect = document.getElementById("generate-select");
const solveSelect = document.getElementById("solve-select");

// Config
const columns = 63;
const rows = 63;
const stepsPerSecond = 8;

// State
const mazeState = createMazeState(columns, rows);
const solveState = createSolveState();

const resetState = (mazeState, solveState, columns, rows) => {
	resetMazeState(mazeState, columns, rows);
	resetSolveState(solveState);
};

let generateStepInterval = null;

const generatePause = () => {
	clearInterval(generateStepInterval);
	generateStepInterval = null;
	generatePlayButton.innerHTML = `<img src="img/play.png">Play`;
};

const generatePlay = (mazeState, solveState) => {
	generateStepInterval = setInterval(() => {
		if (generateSelect.value === "prim") {
			if (generateMazeStepPrim(mazeState)) generatePause();
		}
		else if (generateSelect.value === "wilson") {
			if (generateMazeStepWilson(mazeState)) generatePause();
		}
		else {
			if (generateMazeStepDFS(mazeState)) generatePause();
		}
		drawMaze(canvas, mazeState, solveState);
	}, 1000 / stepsPerSecond);
	generatePlayButton.innerHTML = `<img src="img/pause.png">Pause`;
};

const initGeneration = (mazeState) => {
	if (generateSelect.value === "prim") initMazePrim(mazeState);
	else if (generateSelect.value === "wilson") initMazeWilson(mazeState);
	else initMazeDFS(mazeState);
};

const generateReset = (mazeState, solveState, columns, rows) => {
	if (generateStepInterval != null) generatePause();
	resetState(mazeState, solveState, columns, rows);	
	initGeneration(mazeState);
	drawMaze(canvas, mazeState, solveState);
};

const solveReset = (mazeState, solveState) => {
	resetSolveState(solveState);
	drawMaze(canvas, mazeState, solveState);
};


// Events
generateButton.addEventListener("click", (event) => {
	if (generateStepInterval != null) generatePause();

	if (generateSelect.value === "prim") {
		// Prim's Algorithm
		if (mazeState.frontiers.length === 0) {
			resetState(mazeState, solveState, columns, rows);
			initMazePrim(mazeState);
		}
		generateMazePrim(mazeState);
	}
	else if (generateSelect.value === "wilson") {
		// Wilson's Algorithm
		if (mazeState.unvisited.length === 0) {
			resetState(mazeState, solveState, columns, rows);
			initMazeWilson(mazeState);
		}
		generateMazeWilson(mazeState);
	}
	else {
		// Recursive Backtracking (DFS)
		if (mazeState.path.length === 0) {
			resetState(mazeState, solveState, columns, rows);
			initMazeDFS(mazeState);
		}
		generateMazeDFS(mazeState);
	}

	drawMaze(canvas, mazeState, solveState);
});

generatePlayButton.addEventListener("click", (event) => {
	if (generateStepInterval != null) generatePause();
	else generatePlay(mazeState, solveState);
});

generateStepButton.addEventListener("click", (event) => {
	if (generateStepInterval != null) generatePause();

	if (generateSelect.value === "prim") {
		// Prim's Algorithm
		generateMazeStepPrim(mazeState);
	}
	else if (generateSelect.value === "wilson") {
		// Wilson's Algorithm
		generateMazeStepWilson(mazeState);
	}
	else {
		// Recursive Backtracking (DFS)
		generateMazeStepDFS(mazeState);
	}

	drawMaze(canvas, mazeState, solveState);
});

generateResetButton.addEventListener("click", (event) => {
	generateReset(mazeState, solveState, columns, rows);
});

solveButton.addEventListener("click", (event) => {
	resetSolveState(solveState);
	solveMazeDFS(mazeState, solveState);
	drawMaze(canvas, mazeState, solveState);
});

solvePlayButton.addEventListener("click", (event) => {
	drawMaze(canvas, mazeState, solveState);
});

solveStepButton.addEventListener("click", (event) => {
	drawMaze(canvas, mazeState, solveState);
});

solveResetButton.addEventListener("click", (event) => {
	solveReset(mazeState, solveState);
});

generateSelect.addEventListener("change", (event) => {
	generateReset(mazeState, solveState, columns, rows);
});

solveSelect.addEventListener("change", (event) => {
	solveReset(mazeState, solveState);
});

window.addEventListener("resize", (event) => {
	resizeCanvas(canvas);
	drawMaze(canvas, mazeState, solveState);
});

// Init
resizeCanvas(canvas);
initGeneration(mazeState);
drawMaze(canvas, mazeState, solveState);
