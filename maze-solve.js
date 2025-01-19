import { isInBounds, isPassage, getRandomNode } from "./maze-generate.js";

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
	solveState.isSolved = false;
};

export const createSolveState = () => {
	const solveState = {};
	resetSolveState(solveState);
	return solveState;
};

const isStart = (solveState, cell) => solveState.start.x === cell.x && solveState.start.y === cell.y;
const isEnd = (solveState, cell) => solveState.end.x === cell.x && solveState.end.y === cell.y;
const isChecked = (solveState, cell) => {
	for (let i = 0; i < solveState.checkedPositions.length; i++) {
		if (solveState.checkedPositions[i].x === cell.x && solveState.checkedPositions[i].y === cell.y) return true;
	}
	return false;
};

export const initSolutionDFS = (mazeState, solveState) => {
	if (!mazeState.isGenerated) {
		console.log("Maze must be generated before solving")
		return;
	}

	// Set start position
	solveState.start = getRandomNode(mazeState);
	
	// Set end position
	do {
		solveState.end = getRandomNode(mazeState);
	}
	while (isStart(solveState, solveState.end));

	solveState.currentPath = [[solveState.start, solveState.start]];
	solveState.checkedPositions = [solveState.start];
};

export const solveMazeStepDFS = (mazeState, solveState) => {
	if (!mazeState.isGenerated) {
		console.log("Maze must be generated before solving");
		return true;
	}
	
	if (solveState.currentPath.length === 0) {
		if (solveState.isSolved) {
			console.log("Maze has been solved");
			return true;
		}
		else {
			initSolutionDFS(mazeState, solveState);
		}
	}

	const currentNode = solveState.currentPath[solveState.currentPath.length - 1][0];
	if (isEnd(solveState, currentNode)) {
		solveState.path = [...solveState.currentPath];
		solveState.currentPath = [];
		solveState.isSolved = true;
		return true;
	}

	const neighbours = [];
	for (let i = 0; i < directions.length; i++) {
		const direction = directions[i];
		const newNode = { x: currentNode.x + (direction.dx * 2), y: currentNode.y + (direction.dy * 2) };
		const newEdge = { x: currentNode.x + direction.dx, y: currentNode.y + direction.dy };
		if (isInBounds(mazeState, newNode) && isPassage(mazeState, newEdge) && !isChecked(solveState, newNode)) {
			neighbours.push([newNode, newEdge]);
		}
	}

	if (neighbours.length > 0) {
		const [node, edge] = neighbours[Math.floor(Math.random() * neighbours.length)];
		solveState.currentPath.push([node, edge]);
		solveState.checkedPositions.push(node);
	}
	else if (solveState.currentPath.length > 0) {
		solveState.currentPath.pop();
		if (solveState.currentPath.length === 0) solveState.isSolved = true;
	}

	return solveState.isSolved;
};

export const solveMazeDFS = (mazeState, solveState) => {
	while (!solveMazeStepDFS(mazeState, solveState));
};
