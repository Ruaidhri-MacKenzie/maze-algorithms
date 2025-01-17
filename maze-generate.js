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
	mazeState.edges = [];
	mazeState.lastDirection = { dx: 0, dy: 0 };
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
		const newEdge = { x: currentNode.x + direction.dx, y: currentNode.y + direction.dy };
		if (isUnvisited(mazeState, newNode)) {
			neighbours.push([newNode, newEdge]);
		}
	}

	if (neighbours.length > 0) {
		const [node, edge] = neighbours[Math.floor(Math.random() * neighbours.length)];
		mazeState.path.push([node, edge]);
		removeFromUnvisited(mazeState, node);
		setPassage(mazeState, node);
		setPassage(mazeState, edge);
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
	const [node, edge] = mazeState.frontiers[randomIndex];

	// Check Frontiers
	if (isWall(mazeState, node)) {
		setPassage(mazeState, node);
		setPassage(mazeState, edge);

		for (let i = 0; i < directions.length; i++) {
			const direction = directions[i];
			const nextNode = { x: node.x + (direction.dx * 2), y: node.y + (direction.dy * 2) };
			const nextEdge = { x: node.x + direction.dx, y: node.y + direction.dy };
			if (isInBounds(mazeState, nextNode) && isWall(mazeState, nextNode)) {
				mazeState.frontiers.push([nextNode, nextEdge]);
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

	const walkDirections = directions.filter(direction => {
		return ((direction.dx === -1 && currentNode.x - 2 >= 0 && mazeState.lastDirection.dx !== 1)
		|| (direction.dx === 1 && currentNode.x + 2 < mazeState.columns && mazeState.lastDirection.dx !== -1)
		|| (direction.dy === -1 && currentNode.y - 2 >= 0 && mazeState.lastDirection.dy !== 1)
		|| (direction.dy === 1 && currentNode.y + 2 < mazeState.rows && mazeState.lastDirection.dy !== -1));
	});
	
	const direction = walkDirections[Math.floor(Math.random() * walkDirections.length)];
	mazeState.lastDirection = { ...direction };

	const nextNode = { x: currentNode.x + (direction.dx * 2), y: currentNode.y + (direction.dy * 2) };
	const nextEdge = { x: currentNode.x + direction.dx, y: currentNode.y + direction.dy };

	// Next node has been visited - random walk ends and path will be added to the maze
	if (!isUnvisited(mazeState, nextNode)) {
		mazeState.path.push([nextNode, nextEdge]);
		return true;
	}

	// Loop-erase - when the random walk collides with a node in it's existing path it erases the path after that node
	const duplicatePathElement = mazeState.path.find(([node, edge]) => node.x === nextNode.x && node.y === nextNode.y);
	if (duplicatePathElement != null) {
		const index = mazeState.path.indexOf(duplicatePathElement);
		mazeState.path.splice(index + 1);
		if (mazeState.path.length < 2) {
			mazeState.lastDirection = { dx: 0, dy: 0 };
		}
		else {
			const lastNode = mazeState.path[index][0];
			const secondLastNode = mazeState.path[index - 1][0];
			if (lastNode.x < secondLastNode.x) mazeState.lastDirection = { dx: -1, dy: 0 };
			else if (lastNode.x > secondLastNode.x) mazeState.lastDirection = { dx: 1, dy: 0 };
			else if (lastNode.y < secondLastNode.y) mazeState.lastDirection = { dx: 0, dy: -1 };
			else if (lastNode.y > secondLastNode.y) mazeState.lastDirection = { dx: 0, dy: 1 };
		}
	}
	else {
		mazeState.path.push([nextNode, nextEdge]);
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
			const [node, edge] = mazeState.path[i];
			removeFromUnvisited(mazeState, node);
			setPassage(mazeState, node);
			setPassage(mazeState, edge);
		}
		mazeState.path = [];
		if ((mazeState.unvisited.length === 0)) mazeState.isGenerated = true;

		return mazeState.isGenerated;
	}
};

export const generateMazeWilson = (mazeState) => {
	while (!generateMazeStepWilson(mazeState));
};

export const initMazeKruskal = (mazeState) => {
	for (let y = 0; y < mazeState.rows; y++) {
		for (let x = 0; x < mazeState.columns; x++) {
			if (x % 2 === 0 && y % 2 === 0) {

				// Add all nodes to a list of sets
				mazeState.path.push([toKey({ x, y })]);
				
				// Add all edges to a set
				if (x < mazeState.columns - 2) mazeState.edges.push({ x: x + 1, y });
				if (y < mazeState.rows - 2) mazeState.edges.push({ x, y: y + 1 });
			}
		}
	}
};

export const generateMazeStepKruskal = (mazeState) => {
	if (mazeState.path.length === 1) {
		console.log("Maze has been generated");
		return true;
	}

	let randomIndex, currentEdge, nodeA, nodeB, pathAIndex, pathBIndex = null;
	do {
		// Select a random edge and remove from the set of edges
		randomIndex = Math.floor(Math.random() * mazeState.edges.length);
		currentEdge = mazeState.edges.splice(randomIndex, 1)[0];
		
		// Get nodes depending on horizontal or vertical edge
		nodeA = (currentEdge.x % 2 === 1) ? { x: currentEdge.x - 1 , y: currentEdge.y } : { x: currentEdge.x , y: currentEdge.y - 1 };
		nodeB = (currentEdge.x % 2 === 1) ? { x: currentEdge.x + 1 , y: currentEdge.y } : { x: currentEdge.x , y: currentEdge.y + 1 };
		
		// Check if nodes are in the same path
		for (let i = 0; i < mazeState.path.length; i++) {
			const path = mazeState.path[i];
			if (path.includes(toKey(nodeA))) pathAIndex = i;
			if (path.includes(toKey(nodeB))) pathBIndex = i;
		}
	}
	while (pathAIndex === pathBIndex);

	// Merge paths A and B
	const pathA = mazeState.path[pathAIndex];
	const pathB = mazeState.path[pathBIndex];
	if (pathA.length === 1) setPassage(mazeState, fromKey(pathA[0]));
	if (pathB.length === 1) setPassage(mazeState, fromKey(pathB[0]));
	mazeState.path[pathAIndex].push(...pathB);
	mazeState.path.splice(pathBIndex, 1);
	setPassage(mazeState, currentEdge);

	if ((mazeState.path.length === 1)) mazeState.isGenerated = true;

	return mazeState.isGenerated;
};

export const generateMazeKruskal = (mazeState) => {
	while (!generateMazeStepKruskal(mazeState));
};
