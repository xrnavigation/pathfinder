import { describe, it, expect } from 'vitest';
import { GeoJSONParser } from './geojsonParser';
import { FeatureCollection } from 'geojson';

describe('GeoJSONParser', () => {
  const complexGeoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0]
        },
        properties: { name: 'Point Feature' }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [[0, 0], [1, 1], [2, 2]]
        },
        properties: { name: 'LineString Feature' }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]]
        },
        properties: { name: 'Polygon Feature' }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'MultiPoint',
          coordinates: [[0, 0], [1, 1], [2, 2]]
        },
        properties: { name: 'MultiPoint Feature' }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'MultiLineString',
          coordinates: [
            [[0, 0], [1, 1]],
            [[2, 2], [3, 3]]
          ]
        },
        properties: { name: 'MultiLineString Feature' }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon',
          coordinates: [
            [[[0, 0], [1, 1], [1, 0], [0, 0]]],
            [[[2, 2], [3, 3], [3, 2], [2, 2]]]
          ]
        },
        properties: { name: 'MultiPolygon Feature' }
      }
    ]
  };

  it('should create a GeoJSONParser instance with complex GeoJSON', () => {
    expect(() => new GeoJSONParser(complexGeoJSON)).not.toThrow();
  });

  it('should validate complex features correctly', () => {
    const parser = new GeoJSONParser(complexGeoJSON);
    expect(parser.getFeatures()).toHaveLength(6);
  });

  it('should get features of specific types', () => {
    const parser = new GeoJSONParser(complexGeoJSON);
    expect(parser.getFeaturesOfType('Point')).toHaveLength(1);
    expect(parser.getFeaturesOfType('LineString')).toHaveLength(1);
    expect(parser.getFeaturesOfType('Polygon')).toHaveLength(1);
    expect(parser.getFeaturesOfType('MultiPoint')).toHaveLength(1);
    expect(parser.getFeaturesOfType('MultiLineString')).toHaveLength(1);
    expect(parser.getFeaturesOfType('MultiPolygon')).toHaveLength(1);
  });

  it('should handle features with properties', () => {
    const parser = new GeoJSONParser(complexGeoJSON);
    const features = parser.getFeatures();
    features.forEach(feature => {
      expect(feature.properties).toBeDefined();
      expect(feature.properties.name).toBeDefined();
    });
  });

  it('should throw an error for invalid GeoJSON', () => {
    const invalidGeoJSON = { type: 'InvalidType' };
    expect(() => new GeoJSONParser(invalidGeoJSON as any)).toThrow('Invalid GeoJSON: Must be a FeatureCollection');
  });

  it('should throw an error for invalid features', () => {
    const invalidFeatureGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'InvalidFeature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0]
          },
          properties: {}
        }
      ]
    };
    expect(() => new GeoJSONParser(invalidFeatureGeoJSON)).toThrow('Invalid Feature: Type must be "Feature"');
  });

  it('should handle empty FeatureCollections', () => {
    const emptyGeoJSON: FeatureCollection = {
      type: 'FeatureCollection',
      features: []
    };
    const parser = new GeoJSONParser(emptyGeoJSON);
    expect(parser.getFeatures()).toHaveLength(0);
  });
});
