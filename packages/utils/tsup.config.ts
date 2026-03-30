import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/api/index.ts',
    'src/validation/index.ts',
    'src/search/index.ts',
    'src/pagination/index.ts',
    'src/auth/index.ts',
    'src/hooks/index.ts',
    'src/performance/index.ts',
    'src/media/index.ts',
    'src/string/index.ts',
    'src/array/index.ts',
    'src/object/index.ts',
    'src/date/index.ts',
    'src/number/index.ts',
    'src/storage/index.ts',
    'src/url/index.ts',
    'src/clipboard/index.ts',
    'src/logger/index.ts',
    'src/error/index.ts',
    'src/cache/index.ts',
    'src/types/index.ts',
    'src/constants/index.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    'react',
    'react-dom',
    '@reduxjs/toolkit',
    'react-window',
    'react-virtualized',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});