import { describe, it, expect } from 'vitest';
import { euclideanDistance, haversineDistance } from './utils';

describe('Utility Functions', () => {
  describe('euclideanDistance', () => {
    it('should calculate the correct distance between two points', () => {
      expect(euclideanDistance([0, 0], [3, 4])).toBeCloseTo(5);
      expect(euclideanDistance([1, 1], [4, 5])).toBeCloseTo(5);
      expect(euclideanDistance([-1, -1], [2, 3])).toBeCloseTo(5);
    });

    it('should return 0 for identical points', () => {
      expect(euclideanDistance([0, 0], [0, 0])).toBe(0);
      expect(euclideanDistance([1, 1], [1, 1])).toBe(0);
    });
  });

  describe('haversineDistance', () => {
    it('should calculate the correct distance between two points on Earth', () => {
      // New York City: 40.7128° N, 74.0060° W
      // London: 51.5074° N, 0.1278° W
      const newYork = [-74.0060, 40.7128];
      const london = [-0.1278, 51.5074];
      expect(haversineDistance(newYork, london)).toBeCloseTo(5570, 0); // ~5570 km

      // Tokyo: 35.6762° N, 139.6503° E
      // Sydney: 33.8688° S, 151.2093° E
      const tokyo = [139.6503, 35.6762];
      const sydney = [151.2093, -33.8688];
      expect(haversineDistance(tokyo, sydney)).toBeCloseTo(7825.82, 2); // ~7825.82 km
    });

    it('should return 0 for identical points', () => {
      expect(haversineDistance([0, 0], [0, 0])).toBe(0);
      expect(haversineDistance([45, 45], [45, 45])).toBe(0);
    });

    it('should calculate distance correctly with a custom radius', () => {
      const point1 = [0, 0];
      const point2 = [180, 0];
      const customRadius = 1000;
      expect(haversineDistance(point1, point2, customRadius)).toBeCloseTo(Math.PI * customRadius, 5);
    });
  });
});
