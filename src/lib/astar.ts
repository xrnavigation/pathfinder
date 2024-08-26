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
  nodes: Node[],
  edges: Edge[],
  heuristic: (a: Node, b: Node) => number
): Node[] | null {
  const nodeMap = new Map(nodes.map(node => [node.id, node]));
  const openSet: AStarNode[] = [{ id: start.id, g: 0, h: heuristic(start, goal), f: 0, parent: null }];
  const closedSet = new Set<string>();
  const gScores = new Map<string, number>([[start.id, 0]]);
  const fScores = new Map<string, number>([[start.id, heuristic(start, goal)]]);

  while (openSet.length > 0) {
    const current = openSet.reduce((min, node) => (node.f < min.f ? node : min));
    if (current.id === goal.id) {
      return reconstructPath(current, nodeMap);
    }

    openSet.splice(openSet.indexOf(current), 1);
    closedSet.add(current.id);

    const neighbors = edges.filter(edge => edge.source === current.id || edge.target === current.id);
    for (const edge of neighbors) {
      const neighborId = edge.source === current.id ? edge.target : edge.source;
      if (closedSet.has(neighborId)) continue;

      const tentativeGScore = gScores.get(current.id)! + edge.weight;
      const neighborNode = nodeMap.get(neighborId)!;
      const neighborInOpenSet = openSet.find(node => node.id === neighborId);

      if (!neighborInOpenSet || tentativeGScore < gScores.get(neighborId)!) {
        const h = heuristic(neighborNode, goal);
        const f = tentativeGScore + h;

        if (!neighborInOpenSet) {
          openSet.push({ id: neighborId, g: tentativeGScore, h, f, parent: current.id });
        } else {
          Object.assign(neighborInOpenSet, { g: tentativeGScore, h, f, parent: current.id });
        }

        gScores.set(neighborId, tentativeGScore);
        fScores.set(neighborId, f);
      }
    }
  }

  return null; // No path found
}

function reconstructPath(endNode: AStarNode, nodeMap: Map<string, Node>): Node[] {
  const path: Node[] = [];
  let current: AStarNode | null = endNode;

  while (current) {
    path.unshift(nodeMap.get(current.id)!);
    current = current.parent ? { id: current.parent, g: 0, h: 0, f: 0, parent: null } : null;
  }

  return path;
}
