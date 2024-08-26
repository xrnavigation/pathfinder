import { FeatureCollection } from 'geojson';
import { GeoJSONParser } from './geojsonParser';
import { GraphBuilder, Node, Edge } from './graphBuilder';
import { astar } from './astar';

export class Pathfinder {
  private parser: GeoJSONParser;
  private graphBuilder: GraphBuilder;

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
      throw new Error('Start or goal node not found');
    }

    return astar(start, goal, nodes, edges, this.heuristic);
  }

  private heuristic(a: Node, b: Node): number {
    // Simple Euclidean distance heuristic
    const dx = a.coordinates[0] - b.coordinates[0];
    const dy = a.coordinates[1] - b.coordinates[1];
    return Math.sqrt(dx * dx + dy * dy);
  }
}
