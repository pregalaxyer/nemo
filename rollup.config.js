import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/core/index.ts',
  output: {
    dir: 'lib',
    format: 'cjs',
  },
  plugins: [typescript()],
}