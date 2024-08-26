import { Node, Edge } from './graphBuilder';

class PriorityQueue<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compareFunction: (a: T, b: T) => number) {
    this.compare = compareFunction;
  }

  public push(item: T): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  public pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.bubbleDown(0);
    return top;
  }

  public peek(): T | undefined {
    return this.heap[0];
  }

  public get size(): number {
    return this.heap.length;
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(this.heap[index], this.heap[parentIndex]) < 0) {
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  private bubbleDown(index: number): void {
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (leftChild < this.heap.length && this.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
        smallest = leftChild;
      }

      if (rightChild < this.heap.length && this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
        smallest = rightChild;
      }

      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      } else {
        break;
      }
    }
  }
}

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
  const openSet = new PriorityQueue<AStarNode>((a, b) => a.f - b.f);
  const closedSet = new Set<string>();
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[start.id, 0]]);
  const fScore = new Map<string, number>([[start.id, heuristic(start, goal)]]);

  openSet.push({
    id: start.id,
    g: 0,
    h: heuristic(start, goal),
    f: heuristic(start, goal),
    parent: null
  });

  console.log('Starting A* algorithm');
  console.log('Start node:', start);
  console.log('Goal node:', goal);

  let iterations = 0;
  const MAX_ITERATIONS = 10000; // Adjust this value based on your graph size

  while (openSet.size > 0 && iterations < MAX_ITERATIONS) {
    iterations++;
    const current = openSet.pop()!;

    console.log(`Iteration ${iterations}, Current node:`, nodeMap.get(current.id));

    if (current.id === goal.id) {
      console.log('Goal reached');
      return reconstructPath(cameFrom, current.id, nodeMap);
    }

    closedSet.add(current.id);

    const neighbors = edges.filter(edge => edge.source === current.id || edge.target === current.id);
    console.log('Neighbors:', neighbors);

    for (const edge of neighbors) {
      const neighbor = edge.source === current.id ? edge.target : edge.source;
      
      if (closedSet.has(neighbor)) {
        continue; // Skip already evaluated nodes
      }

      const currentNode = nodeMap.get(current.id)!;
      const neighborNode = nodeMap.get(neighbor)!;
      const levelTransitionCost = currentNode.levelId !== neighborNode.levelId ? levelTransitionPenalty : 0;
      const tentativeGScore = current.g + edge.weight + levelTransitionCost;

      console.log('Evaluating neighbor:', neighborNode);
      console.log('Tentative gScore:', tentativeGScore);

      if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
        cameFrom.set(neighbor, current.id);
        gScore.set(neighbor, tentativeGScore);
        const h = heuristic(neighborNode, goal);
        const f = tentativeGScore + h;
        fScore.set(neighbor, f);

        openSet.push({
          id: neighbor,
          g: tentativeGScore,
          h: h,
          f: f,
          parent: current.id
        });

        console.log('Updated neighbor scores');
      }
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
