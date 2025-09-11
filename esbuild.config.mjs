import esbuild from 'esbuild';
import process from 'process';

// Check if we're in production mode
const isProduction = process.argv.includes('production');

esbuild.build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  minify: isProduction,
  sourcemap: !isProduction,
  format: 'cjs',
  outfile: 'main.js',
  external: ['obsidian'],
  platform: 'node',
  logLevel: 'info',
}).catch(() => process.exit(1));