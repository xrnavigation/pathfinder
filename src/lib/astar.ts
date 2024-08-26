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
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[start.id, 0]]);
  const fScore = new Map<string, number>([[start.id, heuristic(start, goal)]]);

  console.log('Starting A* algorithm');
  console.log('Start node:', start);
  console.log('Goal node:', goal);

  while (openSet.size > 0) {
    const current = Array.from(openSet).reduce((a, b) => 
      (fScore.get(a) || Infinity) < (fScore.get(b) || Infinity) ? a : b
    );

    console.log('Current node:', nodeMap.get(current));

    if (current === goal.id) {
      console.log('Goal reached');
      return reconstructPath(cameFrom, current, nodeMap);
    }

    openSet.delete(current);

    const neighbors = edges.filter(edge => edge.source === current || edge.target === current);
    console.log('Neighbors:', neighbors);

    for (const edge of neighbors) {
      const neighbor = edge.source === current ? edge.target : edge.source;
      const currentNode = nodeMap.get(current)!;
      const neighborNode = nodeMap.get(neighbor)!;
      const levelTransitionCost = currentNode.levelId !== neighborNode.levelId ? levelTransitionPenalty : 0;
      const tentativeGScore = gScore.get(current)! + edge.weight + levelTransitionCost;

      console.log('Evaluating neighbor:', neighborNode);
      console.log('Tentative gScore:', tentativeGScore);

      if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + heuristic(neighborNode, goal));
        openSet.add(neighbor);
        console.log('Updated neighbor scores');
      }
    }
  }

  console.log('No path found');
  return null; // No path found
}

function reconstructPath(cameFrom: Map<string, string>, current: string, nodeMap: Map<string, Node>): Node[] {
  const path = [nodeMap.get(current)!];
  while (cameFrom.has(current)) {
    current = cameFrom.get(current)!;
    path.unshift(nodeMap.get(current)!);
  }
  return path;
}
