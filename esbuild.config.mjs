import { BuildOptions } from 'esbuild';

const config: BuildOptions = {
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV === 'development',
  format: 'cjs',
  outfile: 'main.js',
  external: ['obsidian'],
  platform: 'node',
  logLevel: 'info',
};

export default config;