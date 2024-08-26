import { describe, it, expect } from 'vitest';
import { GraphBuilder } from './graphBuilder';
import { GeoJSONParser } from './geojsonParser';
import { FeatureCollection } from 'geojson';

describe('GraphBuilder', () => {
  const sampleGeoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'node1',
        geometry: {
          type: 'Point',
          coordinates: [0, 0]
        },
        properties: { levelId: 'level1' }
      },
      {
        type: 'Feature',
        id: 'node2',
        geometry: {
          type: 'Point',
          coordinates: [1, 1]
        },
        properties: { levelId: 'level1' }
      },
      {
        type: 'Feature',
        id: 'node3',
        geometry: {
          type: 'Point',
          coordinates: [2, 2]
        },
        properties: { levelId: 'level2' }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [[0, 0], [1, 1], [2, 2]]
        },
        properties: {}
      }
    ]
  };

  it('should build a graph from GeoJSON', () => {
    const parser = new GeoJSONParser(sampleGeoJSON);
    const graphBuilder = new GraphBuilder(parser);
    graphBuilder.buildGraph();

    const nodes = graphBuilder.getNodes();
    const edges = graphBuilder.getEdges();

    expect(nodes).toHaveLength(3);
    expect(edges).toHaveLength(2);

    expect(nodes[0]).toEqual({
      id: 'node1',
      coordinates: [0, 0],
      levelId: 'level1'
    });

    expect(nodes[1]).toEqual({
      id: 'node2',
      coordinates: [1, 1],
      levelId: 'level1'
    });

    expect(nodes[2]).toEqual({
      id: 'node3',
      coordinates: [2, 2],
      levelId: 'level2'
    });

    expect(edges[0]).toEqual({
      source: 'node1',
      target: 'node2',
      weight: Math.sqrt(2)
    });

    expect(edges[1]).toEqual({
      source: 'node2',
      target: 'node3',
      weight: Math.sqrt(2)
    });
  });

  it('should handle GeoJSON without explicit node IDs', () => {
    const geoJSONWithoutIds: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0]
          },
          properties: {}
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [1, 1]
          },
          properties: {}
        }
      ]
    };

    const parser = new GeoJSONParser(geoJSONWithoutIds);
    const graphBuilder = new GraphBuilder(parser);
    graphBuilder.buildGraph();

    const nodes = graphBuilder.getNodes();

    expect(nodes).toHaveLength(2);
    expect(nodes[0].id).toMatch(/^node_\d+$/);
    expect(nodes[1].id).toMatch(/^node_\d+$/);
  });

  it('should handle multi-level graphs', () => {
    const parser = new GeoJSONParser(sampleGeoJSON);
    const graphBuilder = new GraphBuilder(parser);
    graphBuilder.buildGraph();

    const nodes = graphBuilder.getNodes();
    const edges = graphBuilder.getEdges();

    expect(nodes.some(node => node.levelId === 'level1')).toBe(true);
    expect(nodes.some(node => node.levelId === 'level2')).toBe(true);

    // Check if there's an edge between different levels
    const interLevelEdge = edges.find(edge => 
      nodes.find(n => n.id === edge.source)?.levelId !== 
      nodes.find(n => n.id === edge.target)?.levelId
    );
    expect(interLevelEdge).toBeDefined();
  });

  it('should calculate correct edge weights', () => {
    const parser = new GeoJSONParser(sampleGeoJSON);
    const graphBuilder = new GraphBuilder(parser);
    graphBuilder.buildGraph();

    const edges = graphBuilder.getEdges();

    edges.forEach(edge => {
      const sourceNode = graphBuilder.getNodes().find(n => n.id === edge.source);
      const targetNode = graphBuilder.getNodes().find(n => n.id === edge.target);
      if (sourceNode && targetNode) {
        const expectedWeight = Math.sqrt(
          Math.pow(sourceNode.coordinates[0] - targetNode.coordinates[0], 2) +
          Math.pow(sourceNode.coordinates[1] - targetNode.coordinates[1], 2)
        );
        expect(edge.weight).toBeCloseTo(expectedWeight, 5);
      }
    });
  });
});
