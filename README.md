# Pathfinder: IMDF Routing Library

## Overview

Pathfinder is a TypeScript library designed for routing between features in IMDF (Indoor Mapping Data Format) using GeoJSON FeatureCollections. It provides flexible pathfinding capabilities with custom cost functions, allowing for advanced routing scenarios such as multi-level indoor navigation.

## Key Features

- IMDF GeoJSON parsing and processing
- Multi-level pathfinding using `properties.levelId`
- Customizable cost functions
- A* pathfinding algorithm implementation
- TypeScript implementation
- Vite-based build system

## Installation

```bash
npm install pathfinder-imdf
```

## Usage

Here's a basic example of how to use the Pathfinder library:

```typescript
import { Pathfinder } from 'pathfinder-imdf';
import { FeatureCollection } from 'geojson';

// Your GeoJSON FeatureCollection
const geoJSON: FeatureCollection = {
  // ... your GeoJSON data
};

// Initialize the Pathfinder
const pathfinder = new Pathfinder(geoJSON);

// Find a path between two nodes
const path = pathfinder.findPath('startNodeId', 'goalNodeId');

if (path) {
  console.log('Path found:', path.map(node => node.id));
} else {
  console.log('No path found');
}
```

## API Reference

### `Pathfinder`

The main class for pathfinding operations.

#### Constructor

```typescript
constructor(geoJSON: FeatureCollection)
```

Initializes a new Pathfinder instance with the provided GeoJSON FeatureCollection.

#### Methods

- `findPath(startId: string, goalId: string): Node[] | null`
  
  Finds a path between two nodes identified by their IDs. Returns an array of nodes representing the path, or null if no path is found.

- `setLevelTransitionPenalty(penalty: number): void`
  
  Sets the penalty for transitioning between levels. This can be used to adjust the cost of using stairs or elevators.

## Development

To set up the project for development:

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Build the project: `npm run build`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
