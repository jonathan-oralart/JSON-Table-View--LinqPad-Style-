import esbuild from 'esbuild';
import process from 'process';

const isWatch = process.argv.includes('--watch');

const context = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    outfile: 'out/extension.js',
    external: ['vscode'],
    format: 'cjs',
    platform: 'node',
    sourcemap: isWatch, // Only create sourcemaps in watch mode
    minify: !isWatch,   // Minify for production builds
});

if (isWatch) {
    await context.watch();
    console.log('Watching for changes...');
} else {
    await context.rebuild();
    await context.dispose();
    console.log('Build complete.');
} 