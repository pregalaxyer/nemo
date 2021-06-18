import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
const path = require('path');
const fs = require('fs');
const buffer = require('buffer')
const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies);

const mustachePlugin = () => ({
  resolveId: (file, importer) => {
    if (path.extname(file) === '.mustache') {
      return path.resolve(path.dirname(importer), file);
    }
    return null;
  },
  load:  (file) => {
    if (path.extname(file) === '.mustache') {
      
      const text = fs.readFileSync(file, 'utf-8')
      const textBuffer = Buffer.from(text, 'utf-8').toString('base64')

      return `export default "${textBuffer}"`
    }
    return null;
  },
});
export default {
  input: 'src/core/index.ts',
  output: {
    dir: 'lib',
    format: 'cjs',
  },
  plugins: [
    mustachePlugin(),
    typescript(),
    nodeResolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**' // 只编译我们的源代码
    })
  ],
  external: [
    'fs',
    'os',
    'util',
    'http',
    'https',
    ...external,
],
}