import { build, context } from 'esbuild';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const isWatching = !!process.argv.includes('--watch');
const nodePackage = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf8'));

const buildOptions = {
  entryPoints: [resolve(process.cwd(), 'src', 'index.ts')],
  outfile: resolve(process.cwd(), 'dist', 'index.js'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  external: [
    Object.keys(nodePackage.dependencies ?? {}),
    Object.keys(nodePackage.peerDependencies ?? {}),
    Object.keys(nodePackage.devDependencies ?? {}),
  ].flat(),
};

if (isWatching) {
  context(buildOptions).then((ctx) => {
    if (isWatching) {
      ctx.watch();
      console.log('watching...');
    } else {
      ctx.rebuild();
      console.log('building...');
    }
  });
} else {
  build(buildOptions);
}
