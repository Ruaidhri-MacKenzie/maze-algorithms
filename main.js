import { createMazeState, resetMazeState,
	initMazeDFS, generateMazeStepDFS, generateMazeDFS,
	initMazePrim, generateMazeStepPrim, generateMazePrim,
	initMazeWilson, generateMazeStepWilson, generateMazeWilson,
	initMazeKruskal, generateMazeStepKruskal, generateMazeKruskal
} from "./maze-generate.js";
import { createSolveState, resetSolveState, solveMazeDFS } from "./maze-solve.js";
import { resizeCanvas, drawDFS, drawPrim, drawWilson, drawKruskal, drawGeneratedMaze } from "./maze-render.js";

// DOM
const canvas = document.getElementById("maze");
const generateButton = document.getElementById("generate-button");
const playGenerationButton = document.getElementById("generate-play-button");
const generateStepButton = document.getElementById("generate-step-button");
const resetGenerationButton = document.getElementById("generate-reset-button");
const solveButton = document.getElementById("solve-button");
const solvePlayButton = document.getElementById("solve-play-button");
const solveStepButton = document.getElementById("solve-step-button");
const resetSolutionButton = document.getElementById("solve-reset-button");
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

const initMaze = (mazeState) => {
	if (generateSelect.value === "prim") initMazePrim(mazeState);
	else if (generateSelect.value === "wilson") initMazeWilson(mazeState);
	else if (generateSelect.value === "kruskal") initMazeKruskal(mazeState);
	else initMazeDFS(mazeState);
};

const generateMazeStep = (mazeState) => {
	if (generateSelect.value === "prim") return generateMazeStepPrim(mazeState);
	else if (generateSelect.value === "wilson") return generateMazeStepWilson(mazeState);
	else if (generateSelect.value === "kruskal") return generateMazeStepKruskal(mazeState);
	else return generateMazeStepDFS(mazeState);
};

const generateMaze = (mazeState) => {
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
	else if (generateSelect.value === "kruskal") {
		// Kruskal's Algorithm
		if (mazeState.path.length <= 1) {
			resetState(mazeState, solveState, columns, rows);
			initMazeKruskal(mazeState);
		}
		generateMazeKruskal(mazeState);
	}
	else {
		// Recursive Backtracking (DFS)
		if (mazeState.path.length === 0) {
			resetState(mazeState, solveState, columns, rows);
			initMazeDFS(mazeState);
		}
		generateMazeDFS(mazeState);
	}
}

const drawMaze = (canvas, mazeState, solveState) => {
	if (mazeState.isGenerated) drawGeneratedMaze(canvas, mazeState, solveState);
	else if (generateSelect.value === "prim") drawPrim(canvas, mazeState);
	else if (generateSelect.value === "wilson") drawWilson(canvas, mazeState);
	else if (generateSelect.value === "kruskal") drawKruskal(canvas, mazeState);
	else drawDFS(canvas, mazeState);
};

let generateStepInterval = null;

const pauseGeneration = () => {
	clearInterval(generateStepInterval);
	generateStepInterval = null;
	playGenerationButton.innerHTML = `<img src="img/play.png">Play`;
};

const playGeneration = (mazeState, solveState) => {
	generateStepInterval = setInterval(() => {
		if (generateSelect.value === "prim") {
			if (generateMazeStepPrim(mazeState)) pauseGeneration();
		}
		else if (generateSelect.value === "wilson") {
			if (generateMazeStepWilson(mazeState)) pauseGeneration();
		}
		else if (generateSelect.value === "kruskal") {
			if (generateMazeStepKruskal(mazeState)) pauseGeneration();
		}
		else {
			if (generateMazeStepDFS(mazeState)) pauseGeneration();
		}
		drawMaze(canvas, mazeState, solveState);
	}, 1000 / stepsPerSecond);
	playGenerationButton.innerHTML = `<img src="img/pause.png">Pause`;
};

const resetGeneration = (mazeState, solveState, columns, rows) => {
	if (generateStepInterval != null) pauseGeneration();
	resetState(mazeState, solveState, columns, rows);	
	initMaze(mazeState);
	drawMaze(canvas, mazeState, solveState);
};

const resetSolution = (mazeState, solveState) => {
	resetSolveState(solveState);
	drawMaze(canvas, mazeState, solveState);
};


// Events
generateButton.addEventListener("click", (event) => {
	if (generateStepInterval != null) pauseGeneration();
	generateMaze(mazeState);
	drawMaze(canvas, mazeState, solveState);
});

playGenerationButton.addEventListener("click", (event) => {
	if (generateStepInterval != null) pauseGeneration();
	else playGeneration(mazeState, solveState);
});

generateStepButton.addEventListener("click", (event) => {
	if (generateStepInterval != null) pauseGeneration();
	generateMazeStep(mazeState);
	drawMaze(canvas, mazeState, solveState);
});

resetGenerationButton.addEventListener("click", (event) => {
	resetGeneration(mazeState, solveState, columns, rows);
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

resetSolutionButton.addEventListener("click", (event) => {
	resetSolution(mazeState, solveState);
});

generateSelect.addEventListener("change", (event) => {
	resetGeneration(mazeState, solveState, columns, rows);
});

solveSelect.addEventListener("change", (event) => {
	resetSolution(mazeState, solveState);
});

window.addEventListener("resize", (event) => {
	resizeCanvas(canvas);
	drawMaze(canvas, mazeState, solveState);
});

// Init
resizeCanvas(canvas);
initMaze(mazeState);
drawMaze(canvas, mazeState, solveState);
