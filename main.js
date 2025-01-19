import { createMazeState, resetMazeState,
	initGenerationDFS, generateMazeStepDFS, generateMazeDFS,
	initGenerationPrim, generateMazeStepPrim, generateMazePrim,
	initGenerationWilson, generateMazeStepWilson, generateMazeWilson,
	initGenerationKruskal, generateMazeStepKruskal, generateMazeKruskal
} from "./maze-generate.js";
import { createSolveState, resetSolveState, initSolutionDFS, solveMazeStepDFS, solveMazeDFS } from "./maze-solve.js";
import { resizeCanvas, drawDFS, drawPrim, drawWilson, drawKruskal, drawGeneratedMaze } from "./maze-render.js";

// DOM
const canvas = document.getElementById("maze");
const generateButton = document.getElementById("generate-button");
const generatePlayButton = document.getElementById("generate-play-button");
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

const initGeneration = (mazeState) => {
	if (generateSelect.value === "prim") initGenerationPrim(mazeState);
	else if (generateSelect.value === "wilson") initGenerationWilson(mazeState);
	else if (generateSelect.value === "kruskal") initGenerationKruskal(mazeState);
	else initGenerationDFS(mazeState);
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
			initGenerationPrim(mazeState);
		}
		generateMazePrim(mazeState);
	}
	else if (generateSelect.value === "wilson") {
		// Wilson's Algorithm
		if (mazeState.unvisited.length === 0) {
			resetState(mazeState, solveState, columns, rows);
			initGenerationWilson(mazeState);
		}
		generateMazeWilson(mazeState);
	}
	else if (generateSelect.value === "kruskal") {
		// Kruskal's Algorithm
		if (mazeState.path.length <= 1) {
			resetState(mazeState, solveState, columns, rows);
			initGenerationKruskal(mazeState);
		}
		generateMazeKruskal(mazeState);
	}
	else {
		// Recursive Backtracking (DFS)
		if (mazeState.path.length === 0) {
			resetState(mazeState, solveState, columns, rows);
			initGenerationDFS(mazeState);
		}
		generateMazeDFS(mazeState);
	}
}

const solveMazeStep = (mazeState, solveState) => {
	return solveMazeStepDFS(mazeState, solveState);
};

const solveMaze = (mazeState, solveState) => {
	if (solveState.currentPath.length === 0) {
		resetSolveState(solveState);
		initSolutionDFS(mazeState, solveState);
	}
	solveMazeDFS(mazeState, solveState);
};

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
	generatePlayButton.innerHTML = `<img src="img/play.png">Play`;
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
	generatePlayButton.innerHTML = `<img src="img/pause.png">Pause`;
};

const resetGeneration = (mazeState, solveState, columns, rows) => {
	if (generateStepInterval != null) pauseGeneration();
	resetState(mazeState, solveState, columns, rows);	
	initGeneration(mazeState);
	drawMaze(canvas, mazeState, solveState);
};

let solveStepInterval = null;

const pauseSolution = () => {
	if (solveStepInterval == null) return;
	clearInterval(solveStepInterval);
	solveStepInterval = null;
	solvePlayButton.innerHTML = `<img src="img/play.png">Play`;
};

const playSolution = (mazeState, solveState) => {
	solveStepInterval = setInterval(() => {
		if (solveState.currentPath.length === 0 && !solveState.isSolved) initSolutionDFS(mazeState, solveState);
		if (solveMazeStepDFS(mazeState, solveState)) pauseSolution();
		drawMaze(canvas, mazeState, solveState);
	}, 1000 / stepsPerSecond);
	solvePlayButton.innerHTML = `<img src="img/pause.png">Pause`;
};

const resetSolution = (mazeState, solveState) => {
	resetSolveState(solveState);
	initSolutionDFS(mazeState, solveState);
	drawMaze(canvas, mazeState, solveState);
};


// Events
generateButton.addEventListener("click", (event) => {
	if (generateStepInterval != null) pauseGeneration();
	generateMaze(mazeState);
	drawMaze(canvas, mazeState, solveState);
});

generatePlayButton.addEventListener("click", (event) => {
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
	pauseSolution();
	solveMaze(mazeState, solveState);
	drawMaze(canvas, mazeState, solveState);
});

solvePlayButton.addEventListener("click", (event) => {
	if (solveStepInterval != null) pauseSolution();
	else playSolution(mazeState, solveState);
});

solveStepButton.addEventListener("click", (event) => {
	pauseSolution();
	solveMazeStep(mazeState, solveState);
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
initGeneration(mazeState);
drawMaze(canvas, mazeState, solveState);
