import { FeatureCollection } from 'geojson';
import { GeoJSONParser } from './geojsonParser';
import { GraphBuilder, Node, Edge } from './graphBuilder';
import { astar } from './astar';
import { euclideanDistance } from './utils';

export class Pathfinder {
  private parser: GeoJSONParser;
  private graphBuilder: GraphBuilder;
  private levelTransitionPenalty: number = 10; // Penalty for changing levels

  constructor(geoJSON: FeatureCollection) {
    this.parser = new GeoJSONParser(geoJSON);
    this.graphBuilder = new GraphBuilder(this.parser);
    this.graphBuilder.buildGraph();
    console.log('Pathfinder initialized with GeoJSON data');
  }

  findPath(startId: string, goalId: string): Node[] | null {
    const nodes = this.graphBuilder.getNodes();
    const edges = this.graphBuilder.getEdges();

    const start = nodes.find(node => node.id === startId);
    const goal = nodes.find(node => node.id === goalId);

    console.log('Start node:', start);
    console.log('Goal node:', goal);
    console.log('Total nodes:', nodes.length);
    console.log('Total edges:', edges.length);

    if (!start || !goal) {
      console.log('Start or goal node not found');
      return null;
    }

    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    console.log('Node map:', nodeMap);
    console.log('Edges:', edges);

    const path = astar(start, goal, nodeMap, edges, this.heuristic.bind(this), this.levelTransitionPenalty);
    
    if (path === null) {
      console.error('A* algorithm failed to find a path');
      return null;
    } else if (path.length === 0) {
      console.error('A* algorithm returned an empty path');
      return null;
    } else {
      console.log('Path found:', path.map(node => node.id));
    }

    return path;
  }

  // Remove the findIntermediateNodes method as it's no longer needed

  private heuristic(a: Node, b: Node): number {
    // Use euclideanDistance for indoor distance calculation
    const distance = euclideanDistance(a.coordinates, b.coordinates);

    // Add level transition penalty if nodes are on different levels
    const levelPenalty = a.levelId !== b.levelId ? this.levelTransitionPenalty : 0;

    return distance + levelPenalty;
  }

  // Method to set custom level transition penalty
  setLevelTransitionPenalty(penalty: number): void {
    this.levelTransitionPenalty = penalty;
  }
}
