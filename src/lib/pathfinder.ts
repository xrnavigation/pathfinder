import { FeatureCollection } from 'geojson';
import { GeoJSONParser } from './geojsonParser';
import { GraphBuilder, Node, Edge } from './graphBuilder';
import { astar } from './astar';

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

    if (!start || !goal) {
      return null;
    }

    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const path = astar(start, goal, nodeMap, edges, this.heuristic.bind(this), this.levelTransitionPenalty);
    
    return path;
  }

  // Remove the findIntermediateNodes method as it's no longer needed

  private heuristic(a: Node, b: Node): number {
    const dx = a.coordinates[0] - b.coordinates[0];
    const dy = a.coordinates[1] - b.coordinates[1];
    const euclideanDistance = Math.sqrt(dx * dx + dy * dy);

    // Add level transition penalty if nodes are on different levels
    const levelPenalty = a.levelId !== b.levelId ? this.levelTransitionPenalty : 0;

    return euclideanDistance + levelPenalty;
  }

  // Method to set custom level transition penalty
  setLevelTransitionPenalty(penalty: number): void {
    this.levelTransitionPenalty = penalty;
  }
}
