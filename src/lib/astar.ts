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

  while (openSet.size > 0) {
    const current = Array.from(openSet).reduce((a, b) => 
      (fScore.get(a) || Infinity) < (fScore.get(b) || Infinity) ? a : b
    );

    if (current === goal.id) {
      return reconstructPath(cameFrom, current, nodeMap);
    }

    openSet.delete(current);

    const neighbors = edges.filter(edge => edge.source === current || edge.target === current);
    for (const edge of neighbors) {
      const neighbor = edge.source === current ? edge.target : edge.source;
      const currentNode = nodeMap.get(current)!;
      const neighborNode = nodeMap.get(neighbor)!;
      const levelTransitionCost = currentNode.levelId !== neighborNode.levelId ? levelTransitionPenalty : 0;
      const tentativeGScore = (gScore.get(current) || Infinity) + edge.weight + levelTransitionCost;

      if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentativeGScore);
        fScore.set(neighbor, tentativeGScore + heuristic(neighborNode, goal));
        openSet.add(neighbor);
      }
    }
  }

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

function reconstructPath(endNode: AStarNode, nodeMap: Map<string, Node>): Node[] {
  const path: Node[] = [];
  let current: AStarNode | null = endNode;

  while (current) {
    path.unshift(nodeMap.get(current.id)!);
    current = current.parent ? { id: current.parent, g: 0, h: 0, f: 0, parent: current.parent } : null;
  }

  return path;
}
