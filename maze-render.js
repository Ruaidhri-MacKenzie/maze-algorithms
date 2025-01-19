import { isWall, isPassage } from "./maze-generate.js";

const colours = {
	WALL: "#000000",
	PASSAGE: "#ffffff",
	GRID: "#222222",
	PATH: "#5555ff",
	SOLUTION_PATH: "#ffff00",
	SOLUTION_CURRENT_PATH: "#aaaa00",
	START: "#ff0000",
	END: "#0000ff",
};

export const resizeCanvas = (canvas) => {
	canvas.width = canvas.getBoundingClientRect().width;
	canvas.height = canvas.getBoundingClientRect().height;
};

const drawGridCells = (ctx, tileSize, mazeState) => {
	for (let y = 0; y < mazeState.rows; y++) {
		for (let x = 0; x < mazeState.columns; x++) {
			if (isWall(mazeState, { x, y })) {
				// Wall
				ctx.fillStyle = colours.WALL;
				ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
			}
			else if (isPassage(mazeState, { x, y })) {
				// Passage
				ctx.fillStyle = colours.PASSAGE;
				ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
			}
		}
	}
};

const drawGridLines = (ctx, tileSize, columns, rows) => {
	for (let y = 0; y < rows; y++) {
		for (let x = 0; x < columns; x++) {
			ctx.strokeStyle = colours.GRID;
			ctx.lineWidth = 1;
			ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
		}
	}
};

const drawPath = (ctx, tileSize, mazeState) => {
	for (let i = 0; i < mazeState.path.length; i++) {
		// Path
		const [node, edge] = mazeState.path[i];
		ctx.fillStyle = colours.PATH;
		ctx.fillRect(node.x * tileSize, node.y * tileSize, tileSize, tileSize);
		ctx.fillRect(edge.x * tileSize, edge.y * tileSize, tileSize, tileSize);
	}
};

export const drawDFS = (canvas, mazeState) => {
	const ctx = canvas.getContext("2d");
	const tileSize = Math.min(canvas.width / mazeState.columns, canvas.height / mazeState.rows);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGridCells(ctx, tileSize, mazeState);
	drawPath(ctx, tileSize, mazeState);
	drawGridLines(ctx, tileSize, mazeState.columns, mazeState.rows);
};

export const drawPrim = (canvas, mazeState) => {
	const ctx = canvas.getContext("2d");
	const tileSize = Math.min(canvas.width / mazeState.columns, canvas.height / mazeState.rows);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGridCells(ctx, tileSize, mazeState);
	drawGridLines(ctx, tileSize, mazeState.columns, mazeState.rows);
};

export const drawWilson = (canvas, mazeState) => {
	const ctx = canvas.getContext("2d");
	const tileSize = Math.min(canvas.width / mazeState.columns, canvas.height / mazeState.rows);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGridCells(ctx, tileSize, mazeState);
	drawPath(ctx, tileSize, mazeState);
	drawGridLines(ctx, tileSize, mazeState.columns, mazeState.rows);
};

export const drawKruskal = (canvas, mazeState) => {
	const ctx = canvas.getContext("2d");
	const tileSize = Math.min(canvas.width / mazeState.columns, canvas.height / mazeState.rows);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGridCells(ctx, tileSize, mazeState);
	drawGridLines(ctx, tileSize, mazeState.columns, mazeState.rows);
};

const drawSolutionPath = (ctx, tileSize, solveState) => {
	for (let i = 0; i < solveState.path.length; i++) {
		// Solution Optimal Path
		const [node, edge] = solveState.path[i];
		ctx.fillStyle = colours.SOLUTION_PATH;
		ctx.fillRect(node.x * tileSize, node.y * tileSize, tileSize, tileSize);
		ctx.fillRect(edge.x * tileSize, edge.y * tileSize, tileSize, tileSize);
	}
};

const drawSolutionCurrentPath = (ctx, tileSize, solveState) => {
	for (let i = 0; i < solveState.currentPath.length; i++) {
		// Solution Current Path
		const [node, edge] = solveState.currentPath[i];
		ctx.fillStyle = colours.SOLUTION_CURRENT_PATH;
		ctx.fillRect(node.x * tileSize, node.y * tileSize, tileSize, tileSize);
		ctx.fillRect(edge.x * tileSize, edge.y * tileSize, tileSize, tileSize);
	}
};

const drawSolutionStartPoint = (ctx, tileSize, solveState) => {
	if (solveState.start.x != null && solveState.start.y != null) {
		// Start Point
		ctx.fillStyle = colours.START;
		ctx.fillRect(solveState.start.x * tileSize, solveState.start.y * tileSize, tileSize, tileSize);
	}
};

const drawSolutionEndPoint = (ctx, tileSize, solveState) => {
	if (solveState.end.x != null && solveState.end.y != null) {
		// End Point
		ctx.fillStyle = colours.END;
		ctx.fillRect(solveState.end.x * tileSize, solveState.end.y * tileSize, tileSize, tileSize);
	}
};

export const drawGeneratedMaze = (canvas, mazeState, solveState) => {
	const ctx = canvas.getContext("2d");
	const tileSize = Math.min(canvas.width / mazeState.columns, canvas.height / mazeState.rows);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGridCells(ctx, tileSize, mazeState);
	drawSolutionCurrentPath(ctx, tileSize, solveState);
	drawSolutionPath(ctx, tileSize, solveState);
	drawSolutionStartPoint(ctx, tileSize, solveState);
	drawSolutionEndPoint(ctx, tileSize, solveState);
	drawGridLines(ctx, tileSize, mazeState.columns, mazeState.rows);
};
