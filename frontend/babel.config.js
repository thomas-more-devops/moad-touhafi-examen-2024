module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',  // Ensures compatibility with Node.js
        },
        modules: 'auto',  // Automatically handles module transformation (ESM or CommonJS)
      },
    ],
  ],
  plugins: ['@babel/plugin-transform-runtime'],
};
