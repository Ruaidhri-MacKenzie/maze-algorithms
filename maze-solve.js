import { isInBounds, isWall } from "./maze-generate.js";

const directions = [
	{ dx: -1, dy: 0 },
	{ dx: 1, dy: 0 },
	{ dx: 0, dy: -1 },
	{ dx: 0, dy: 1 },
];

export const resetSolveState = (solveState) => {
	solveState.start = { x: null, y: null };
	solveState.end = { x: null, y: null };
	solveState.path = [];
	solveState.currentPath = [];
	solveState.checkedPositions = [];
};

export const createSolveState = () => {
	const solveState = {};
	resetSolveState(solveState);
	return solveState;
};

const isStart = (solveState, position) => solveState.start.x === position.x && solveState.start.y === position.y;
const isEnd = (solveState, position) => solveState.end.x === position.x && solveState.end.y === position.y;
const isChecked = (solveState, position) => {
	for (let i = 0; i < solveState.checkedPositions.length; i++) {
		if (solveState.checkedPositions[i].x === position.x && solveState.checkedPositions[i].y === position.y) return true;
	}
	return false;
};

const checkNeighbours = (mazeState, solveState, position) => {
	if (isEnd(solveState, position)) {
		if (solveState.path.length === 0 || solveState.currentPath.length < solveState.path.length) {
			solveState.path = [...solveState.currentPath];
		}
		return;
	}

	solveState.checkedPositions.push(position);

	for (let i = 0; i < directions.length; i++) {
		const direction = directions[i];
		const nextPosition = { x: position.x + direction.dx, y: position.y + direction.dy };
		if (isInBounds(mazeState, nextPosition) && !isWall(mazeState, nextPosition) && !isChecked(solveState, nextPosition)) {
			solveState.currentPath.push(nextPosition);
			checkNeighbours(mazeState, solveState, nextPosition);
			solveState.currentPath.pop();
		}
	}
};

export const solveMazeStepDFS = (mazeState, solveState) => {
	if (!mazeState.isGenerated) {
		console.log("Maze must be generated before solving");
		return;
	}
	
	if (solveState.start.x == null || solveState.start.y == null || solveState.end.x == null || solveState.end.y == null) {
		console.log("Start and end points must be set");
		return;
	}

	
};

export const solveMazeDFS = (mazeState, solveState) => {
	if (!mazeState.isGenerated) {
		console.log("Maze must be generated before solving");
		return;
	}
	
	// Set start position
	do {
		solveState.start.x = Math.floor(Math.random() * mazeState.columns);
		solveState.start.y = Math.floor(Math.random() * mazeState.rows);
	}
	while (isWall(mazeState, solveState.start));

	// Set end position
	do {
		solveState.end.x = Math.floor(Math.random() * mazeState.columns);
		solveState.end.y = Math.floor(Math.random() * mazeState.rows);
	}
	while (isWall(mazeState, solveState.end) || isStart(solveState, solveState.end));
	
	solveState.currentPath = [solveState.start];
	checkNeighbours(mazeState, solveState, solveState.start);
};
