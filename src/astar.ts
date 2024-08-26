import { Node, Edge } from './graphBuilder';

interface AStarNode {
  id: string;
  g: number;
  h: number;
  f: number;
  parent: string | null;
}

export function astar(
  start: Node,
  goal: Node,
  nodeMap: Map<string, Node>,
  edges: Edge[],
  heuristic: (a: Node, b: Node) => number,
  levelTransitionPenalty: number
): Node[] | null {
  const openSet = new Set<string>([start.id]);
  const closedSet = new Set<string>();
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[start.id, 0]]);
  const fScore = new Map<string, number>([[start.id, heuristic(start, goal)]]);

  console.log('Starting A* algorithm');
  console.log('Start node:', start);
  console.log('Goal node:', goal);

  let iterations = 0;
  const MAX_ITERATIONS = 10000; // Adjust this value based on your graph size

  while (openSet.size > 0 && iterations < MAX_ITERATIONS) {
    iterations++;
    const current = Array.from(openSet).reduce((a, b) => 
      (fScore.get(a) || Infinity) < (fScore.get(b) || Infinity) ? a : b
    );

    console.log(`Iteration ${iterations}, Current node:`, nodeMap.get(current));

    if (current === goal.id) {
      console.log('Goal reached');
      return reconstructPath(cameFrom, current, nodeMap);
    }

    openSet.delete(current);
    closedSet.add(current);

    const neighbors = edges.filter(edge => edge.source === current || edge.target === current);
    console.log('Neighbors:', neighbors);

    for (const edge of neighbors) {
      const neighbor = edge.source === current ? edge.target : edge.source;
      
      if (closedSet.has(neighbor)) {
        continue; // Skip already evaluated nodes
      }

      const currentNode = nodeMap.get(current)!;
      const neighborNode = nodeMap.get(neighbor)!;
      const levelTransitionCost = currentNode.levelId !== neighborNode.levelId ? levelTransitionPenalty : 0;
      const tentativeGScore = gScore.get(current)! + edge.weight + levelTransitionCost;

      console.log('Evaluating neighbor:', neighborNode);
      console.log('Tentative gScore:', tentativeGScore);

      if (!openSet.has(neighbor)) {
        openSet.add(neighbor);
      } else if (tentativeGScore >= (gScore.get(neighbor) || Infinity)) {
        continue; // This is not a better path
      }

      cameFrom.set(neighbor, current);
      gScore.set(neighbor, tentativeGScore);
      fScore.set(neighbor, tentativeGScore + heuristic(neighborNode, goal));
      console.log('Updated neighbor scores');
    }
  }

  if (iterations >= MAX_ITERATIONS) {
    console.log('A* algorithm reached maximum iterations');
  } else {
    console.log('No path found');
  }
  return null; // No path found or max iterations reached
}

function reconstructPath(cameFrom: Map<string, string>, current: string, nodeMap: Map<string, Node>): Node[] {
  const path = [nodeMap.get(current)!];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!;
    path.unshift(nodeMap.get(current)!);
  }
  return path;
}
