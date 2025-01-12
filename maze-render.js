import { isWall, isPassage } from "./maze-generate.js";

export const resizeCanvas = (canvas) => {
	canvas.width = canvas.getBoundingClientRect().width;
	canvas.height = canvas.getBoundingClientRect().height;
};

export const drawMaze = (canvas, mazeState, solveState) => {
	const ctx = canvas.getContext("2d");
	const tileSize = Math.min(canvas.width / mazeState.columns, canvas.height / mazeState.rows);

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let y = 0; y < mazeState.rows; y++) {
		for (let x = 0; x < mazeState.columns; x++) {
			if (isWall(mazeState, { x, y })) {
				// Wall
				ctx.fillStyle = "#000000";
				ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
			}
			else if (isPassage(mazeState, { x, y })) {
				// Passage
				ctx.fillStyle = "#ffffff";
				ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
			}
		}
	}

	for (let i = 0; i < mazeState.frontiers.length; i++) {
		// Frontier
		const [node, connection] = mazeState.frontiers[i];
		ctx.fillStyle = "#555555";
		ctx.fillRect(node.x * tileSize, node.y * tileSize, tileSize, tileSize);
		ctx.fillRect(connection.x * tileSize, connection.y * tileSize, tileSize, tileSize);
	}

	for (let i = 0; i < mazeState.path.length; i++) {
		// Random Walk
		const [node, connection] = mazeState.path[i];
		ctx.fillStyle = "#5555ff";
		ctx.fillRect(node.x * tileSize, node.y * tileSize, tileSize, tileSize);
		ctx.fillRect(connection.x * tileSize, connection.y * tileSize, tileSize, tileSize);
	}

	for (let i = 0; i < solveState.path.length; i++) {
		const step = solveState.path[i];
		// Solution Path
		ctx.fillStyle = "#ffff00";
		ctx.fillRect(step.x * tileSize, step.y * tileSize, tileSize, tileSize);
	}

	if (solveState.start.x != null && solveState.start.y != null) {
		// Start Point
		ctx.fillStyle = "#ff0000";
		ctx.fillRect(solveState.start.x * tileSize, solveState.start.y * tileSize, tileSize, tileSize);
	}

	if (solveState.end.x != null && solveState.end.y != null) {
		// End Point
		ctx.fillStyle = "#0000ff";
		ctx.fillRect(solveState.end.x * tileSize, solveState.end.y * tileSize, tileSize, tileSize);
	}

	for (let y = 0; y < mazeState.rows; y++) {
		for (let x = 0; x < mazeState.columns; x++) {
			// Grid Lines
			ctx.strokeStyle = "#222222";
			ctx.lineWidth = 1;
			ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
		}
	}
};
