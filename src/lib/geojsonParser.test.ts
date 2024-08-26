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
});
