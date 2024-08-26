import { Feature, FeatureCollection, Geometry } from 'geojson';

export class GeoJSONParser {
  private featureCollection: FeatureCollection;

  constructor(geoJSON: FeatureCollection) {
    this.featureCollection = this.validate(geoJSON);
  }

  private validate(geoJSON: FeatureCollection): FeatureCollection {
    if (!geoJSON || typeof geoJSON !== 'object') {
      throw new Error('Invalid GeoJSON: Must be an object');
    }
    if (geoJSON.type !== 'FeatureCollection') {
      throw new Error('Invalid GeoJSON: Must be a FeatureCollection');
    }
    if (!Array.isArray(geoJSON.features)) {
      throw new Error('Invalid GeoJSON: Features must be an array');
    }
    geoJSON.features.forEach(this.validateFeature);
    return geoJSON;
  }

  private validateFeature(feature: Feature): void {
    if (!feature || typeof feature !== 'object') {
      throw new Error('Invalid Feature: Must be an object');
    }
    if (feature.type !== 'Feature') {
      throw new Error('Invalid Feature: Type must be "Feature"');
    }
    if (!feature.geometry || typeof feature.geometry !== 'object') {
      throw new Error('Invalid Feature: Must have a geometry object');
    }
    if (!feature.properties || typeof feature.properties !== 'object') {
      throw new Error('Invalid Feature: Must have a properties object');
    }
  }

  public getFeatures(): Feature[] {
    return this.featureCollection.features.map(feature => {
      this.validateFeature(feature);
      return feature;
    });
  }

  // TODO: Implement more parsing and utility methods
}
