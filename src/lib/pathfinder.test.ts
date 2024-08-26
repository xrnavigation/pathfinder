import { describe, it, expect } from 'vitest';
import { Pathfinder } from './pathfinder';
import { FeatureCollection } from 'geojson';

describe('Pathfinder', () => {
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
        properties: { levelId: 'level1' }
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

  it('should find a path between two nodes', () => {
    const pathfinder = new Pathfinder(sampleGeoJSON);
    const path = pathfinder.findPath('node1', 'node3');

    expect(path).toBeDefined();
    expect(path).toHaveLength(3);
    expect(path![0].id).toBe('node1');
    expect(path![1].id).toBe('node2');
    expect(path![2].id).toBe('node3');
  });

  it('should return null for non-existent path', () => {
    const pathfinder = new Pathfinder(sampleGeoJSON);
    const path = pathfinder.findPath('node1', 'non_existent_node');

    expect(path).toBeNull();
  });
});
