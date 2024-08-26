import { FeatureCollection } from 'geojson';
import { GeoJSONParser } from './geojsonParser';

export class Pathfinder {
  private parser: GeoJSONParser;

  constructor(geoJSON: FeatureCollection) {
    this.parser = new GeoJSONParser(geoJSON);
    console.log('Pathfinder initialized with GeoJSON data');
  }

  // TODO: Implement pathfinding methods
}
