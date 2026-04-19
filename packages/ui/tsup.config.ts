import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'lib/utils.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})
