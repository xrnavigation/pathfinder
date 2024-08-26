import { Feature, FeatureCollection, Geometry } from 'geojson';
import { GeoJSONParser } from './geojsonParser';

interface Node {
  id: string;
  coordinates: number[];
  levelId: string;
}

interface Edge {
  source: string;
  target: string;
  weight: number;
}

export class GraphBuilder {
  private nodes: Map<string, Node> = new Map();
  private edges: Edge[] = [];

  constructor(private parser: GeoJSONParser) {}

  buildGraph(): void {
    const features = this.parser.getFeatures();
    this.createNodes(features);
    this.createEdges(features);
  }

  private createNodes(features: Feature[]): void {
    features.forEach(feature => {
      if (feature.geometry.type === 'Point') {
        const coordinates = feature.geometry.coordinates as number[];
        const levelId = feature.properties?.levelId || 'default';
        const node: Node = {
          id: feature.id?.toString() || `node_${this.nodes.size}`,
          coordinates,
          levelId
        };
        this.nodes.set(node.id, node);
      }
    });
  }

  private createEdges(features: Feature[]): void {
    features.forEach(feature => {
      if (feature.geometry.type === 'LineString') {
        const coordinates = feature.geometry.coordinates as number[][];
        for (let i = 0; i < coordinates.length - 1; i++) {
          const sourceId = this.findClosestNode(coordinates[i]).id;
          const targetId = this.findClosestNode(coordinates[i + 1]).id;
          const weight = this.calculateDistance(coordinates[i], coordinates[i + 1]);
          this.edges.push({ source: sourceId, target: targetId, weight });
        }
      }
    });
  }

  private findClosestNode(coordinates: number[]): Node {
    let closestNode: Node | null = null;
    let minDistance = Infinity;

    for (const node of this.nodes.values()) {
      const distance = this.calculateDistance(coordinates, node.coordinates);
      if (distance < minDistance) {
        minDistance = distance;
        closestNode = node;
      }
    }

    if (!closestNode) {
      throw new Error('No nodes found in the graph');
    }

    return closestNode;
  }

  private calculateDistance(coord1: number[], coord2: number[]): number {
    const dx = coord1[0] - coord2[0];
    const dy = coord1[1] - coord2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  getNodes(): Node[] {
    return Array.from(this.nodes.values());
  }

  getEdges(): Edge[] {
    return this.edges;
  }
}
