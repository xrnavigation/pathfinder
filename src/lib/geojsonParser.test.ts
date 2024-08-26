import { describe, it, expect } from 'vitest';
import { GeoJSONParser } from './geojsonParser';
import { FeatureCollection } from 'geojson';

describe('GeoJSONParser', () => {
  const validGeoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [0, 0]
        },
        properties: {}
      }
    ]
  };

  it('should create a GeoJSONParser instance with valid GeoJSON', () => {
    expect(() => new GeoJSONParser(validGeoJSON)).not.toThrow();
  });

  it('should throw an error for invalid GeoJSON', () => {
    const invalidGeoJSON = { type: 'InvalidType' };
    expect(() => new GeoJSONParser(invalidGeoJSON as any)).toThrow('Invalid GeoJSON: Must be a FeatureCollection');
  });

  it('should validate features correctly', () => {
    const parser = new GeoJSONParser(validGeoJSON);
    expect(parser.getFeatures()).toHaveLength(1);
  });

  it('should get features of a specific type', () => {
    const mixedGeoJSON: FeatureCollection = {
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
            type: 'LineString',
            coordinates: [[0, 0], [1, 1]]
          },
          properties: {}
        }
      ]
    };

    const parser = new GeoJSONParser(mixedGeoJSON);
    expect(parser.getFeaturesOfType('Point')).toHaveLength(1);
    expect(parser.getFeaturesOfType('LineString')).toHaveLength(1);
    expect(parser.getFeaturesOfType('Polygon')).toHaveLength(0);
  });
});
