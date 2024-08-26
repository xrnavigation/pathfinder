import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib/pathfinder.ts'),
      name: 'Pathfinder',
      fileName: (format) => `pathfinder.${format}.js`
    },
    rollupOptions: {
      external: ['geojson'],
      output: {
        globals: {
          geojson: 'GeoJSON'
        }
      }
    }
  }
})
