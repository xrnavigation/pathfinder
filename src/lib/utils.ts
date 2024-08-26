/**
 * Calculates the Euclidean distance between two points in 2D space.
 * @param point1 An array of two numbers representing x and y coordinates of the first point.
 * @param point2 An array of two numbers representing x and y coordinates of the second point.
 * @returns The Euclidean distance between the two points.
 */
export function euclideanDistance(point1: number[], point2: number[]): number {
  const dx = point1[0] - point2[0];
  const dy = point1[1] - point2[1];
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculates the Haversine distance between two points on a sphere (like Earth).
 * @param point1 An array of two numbers representing longitude and latitude of the first point in degrees.
 * @param point2 An array of two numbers representing longitude and latitude of the second point in degrees.
 * @param radius The radius of the sphere (default is Earth's radius in kilometers).
 * @returns The Haversine distance between the two points in the same unit as the radius.
 */
export function haversineDistance(point1: number[], point2: number[], radius: number = 6371): number {
  const [lon1, lat1] = point1.map(coord => coord * Math.PI / 180);
  const [lon2, lat2] = point2.map(coord => coord * Math.PI / 180);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return radius * c;
}
