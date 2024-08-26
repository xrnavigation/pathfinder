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
        geometry: {
          type: 'LineString',
          coordinates: [[0, 0], [1, 1]]
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

    expect(nodes).toHaveLength(2);
    expect(edges).toHaveLength(1);

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

    expect(edges[0]).toEqual({
      source: 'node1',
      target: 'node2',
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
});
