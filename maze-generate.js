const cellType = {
	WALL: 0,
	PASSAGE: 1,
};

const directions = [
	{ dx: -1, dy: 0 },
	{ dx: 1, dy: 0 },
	{ dx: 0, dy: -1 },
	{ dx: 0, dy: 1 },
];

export const resetMazeState = (mazeState, columns, rows) => {
	mazeState.columns = columns;
	mazeState.rows = rows;
	mazeState.maze = new Array(rows).fill(0).map(row => new Array(columns).fill(cellType.WALL));
	mazeState.isGenerated = false;
	mazeState.frontiers = [];
	mazeState.unvisited = [];
	mazeState.path = [];
	mazeState.lastDirection = { x: null, y: null };
};

export const createMazeState = (columns, rows) => {
	const mazeState = {};
	resetMazeState(mazeState, columns, rows);
	return mazeState;
};

export const isInBounds = (mazeState, cell) => cell.x >= 0 && cell.x < mazeState.columns && cell.y >= 0 && cell.y < mazeState.rows;
export const isWall = (mazeState, cell) => mazeState.maze[cell.y][cell.x] === cellType.WALL;
export const setWall = (mazeState, cell) => mazeState.maze[cell.y][cell.x] = cellType.WALL;
export const isPassage = (mazeState, cell) => mazeState.maze[cell.y][cell.x] === cellType.PASSAGE;
export const setPassage = (mazeState, cell) => mazeState.maze[cell.y][cell.x] = cellType.PASSAGE;

const toKey = (cell) => `${cell.x},${cell.y}`;
const fromKey = (key) => {
	const [x, y] = key.split(",").map(Number);
	return { x, y };
};

const isUnvisited = (mazeState, cell) => mazeState.unvisited.includes(toKey(cell));
const setUnvisited = (mazeState, cell) => mazeState.unvisited.push(toKey(cell));
const getUnvisitedNode = (mazeState) => fromKey(mazeState.unvisited[Math.floor(Math.random() * mazeState.unvisited.length)]);
const removeFromUnvisited = (mazeState, cell) => {
	mazeState.unvisited = mazeState.unvisited.filter(key => toKey(cell) !== key);
};

export const initMazeDFS = (mazeState) => {
	// Create list of all nodes
	mazeState.unvisited = [];
	for (let y = 0; y < mazeState.rows; y++) {
		for (let x = 0; x < mazeState.columns; x++) {
			if (x % 2 === 0 && y % 2 === 0) setUnvisited(mazeState, { x, y });
		}
	}

	const startNode = getUnvisitedNode(mazeState);
	removeFromUnvisited(mazeState, startNode);
	setPassage(mazeState, startNode);
	mazeState.path = [[startNode, startNode]];
};

export const generateMazeStepDFS = (mazeState) => {
	if (mazeState.path.length === 0) {
		console.log("Maze has been generated");
		return true;
	}

	const currentNode = mazeState.path[mazeState.path.length - 1][0];

	const neighbours = [];
	for (let i = 0; i < directions.length; i++) {
		const direction = directions[i];
		const newNode = { x: currentNode.x + (direction.dx * 2), y: currentNode.y + (direction.dy * 2) };
		const newConnection = { x: currentNode.x + direction.dx, y: currentNode.y + direction.dy };
		if (isUnvisited(mazeState, newNode)) {
			neighbours.push([newNode, newConnection]);
		}
	}

	if (neighbours.length > 0) {
		const [node, connection] = neighbours[Math.floor(Math.random() * neighbours.length)];
		mazeState.path.push([node, connection]);
		removeFromUnvisited(mazeState, node);
		setPassage(mazeState, node);
		setPassage(mazeState, connection);
	}
	else if (mazeState.path.length > 0) {
		mazeState.path.pop();
		if (mazeState.path.length === 0) mazeState.isGenerated = true;
	}

	return mazeState.isGenerated;
};

export const generateMazeDFS = (mazeState) => {
	while (!generateMazeStepDFS(mazeState));
};

export const initMazePrim = (mazeState) => {
	const startNode = { x: Math.floor(Math.random() * (mazeState.columns / 2)) * 2, y: Math.floor(Math.random() * (mazeState.rows / 2)) * 2 };
	mazeState.frontiers = [[startNode, startNode]];
};

export const generateMazeStepPrim = (mazeState) => {
	if (mazeState.frontiers.length === 0) {
		console.log("Maze has been generated");
		return true;
	}

	const randomIndex = Math.floor(Math.random() * mazeState.frontiers.length);
	const [node, connection] = mazeState.frontiers[randomIndex];

	// Check Frontiers
	if (isWall(mazeState, node)) {
		setPassage(mazeState, node);
		setPassage(mazeState, connection);

		for (let i = 0; i < directions.length; i++) {
			const direction = directions[i];
			const nextNode = { x: node.x + (direction.dx * 2), y: node.y + (direction.dy * 2) };
			const nextConnection = { x: node.x + direction.dx, y: node.y + direction.dy };
			if (isInBounds(mazeState, nextNode) && isWall(mazeState, nextNode)) {
				mazeState.frontiers.push([nextNode, nextConnection]);
			}
		}
	}

	mazeState.frontiers.splice(randomIndex, 1);
	if (mazeState.frontiers.length === 0) mazeState.isGenerated = true;

	return mazeState.isGenerated;
};

export const generateMazePrim = (mazeState) => {
	while (!generateMazeStepPrim(mazeState));
};

const randomWalkStep = (mazeState) => {
	if (mazeState.path.length === 0) return true;

	const currentNode = mazeState.path[mazeState.path.length - 1][0];
	let direction = null;
	do {
		direction = directions[Math.floor(Math.random() * directions.length)];
	}
	while ((direction.dx !== 0 && direction.dx === mazeState.lastDirection.dx * -1) || (direction.dy !== 0 && direction.dy === mazeState.lastDirection.dy * -1));
	mazeState.lastDirection = direction;

	const nextNode = { x: currentNode.x + (direction.dx * 2), y: currentNode.y + (direction.dy * 2) };
	const nextConnection = { x: currentNode.x + direction.dx, y: currentNode.y + direction.dy };
	if (!isInBounds(mazeState, nextNode)) return false;

	// Next node has been visited
	if (!isUnvisited(mazeState, nextNode)) {
		mazeState.path.push([nextNode, nextConnection]);
		return true;
	}

	const duplicatePathElement = mazeState.path.find(([node, connection]) => node.x === nextNode.x && node.y === nextNode.y);
	if (duplicatePathElement != null) {
		const index = mazeState.path.indexOf(duplicatePathElement);
		mazeState.path.splice(index + 1);
	}
	else {
		mazeState.path.push([nextNode, nextConnection]);
	}

	return false;
};

export const initMazeWilson = (mazeState) => {
	// Create list of all nodes
	mazeState.unvisited = [];
	for (let y = 0; y < mazeState.rows; y++) {
		for (let x = 0; x < mazeState.columns; x++) {
			if (x % 2 === 0 && y % 2 === 0) setUnvisited(mazeState, { x, y });
		}
	}

	// Choose any vertex at random and add it to the UST.
	const startNode = getUnvisitedNode(mazeState);
	removeFromUnvisited(mazeState, startNode);
	setPassage(mazeState, startNode);
};

export const generateMazeStepWilson = (mazeState) => {
	if (mazeState.unvisited.length === 0) {
		console.log("Maze has been generated");
		return true;
	}

	if (mazeState.path.length === 0) {
		// Select any vertex that is not already in the UST to start the random walk from.
		const currentNode = getUnvisitedNode(mazeState);
		mazeState.path = [[currentNode, currentNode]];
	}

	if (randomWalkStep(mazeState)) {
		// Add the vertices and edges touched in the random walk to the UST.
		for (let i = 0; i < mazeState.path.length; i++) {
			const [node, connection] = mazeState.path[i];
			removeFromUnvisited(mazeState, node);
			setPassage(mazeState, node);
			setPassage(mazeState, connection);
		}
		mazeState.path = [];
		if ((mazeState.unvisited.length === 0)) mazeState.isGenerated = true;

		return mazeState.isGenerated;
	}
};

export const generateMazeWilson = (mazeState) => {
	while (!generateMazeStepWilson(mazeState));
};
