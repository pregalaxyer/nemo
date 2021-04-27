import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
const pkg = require('./package.json');
const external = Object.keys(pkg.dependencies);
export default {
  input: 'src/core/index.ts',
  output: {
    dir: 'lib',
    format: 'cjs',
  },
  plugins: [
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