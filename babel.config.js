// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: '14.16.0'}}],
    '@babel/preset-typescript',
  ],
};