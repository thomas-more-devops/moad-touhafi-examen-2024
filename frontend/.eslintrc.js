module.exports = {
    env: {
      browser: true,
      node: true,
      jest: true // Voeg ondersteuning voor Jest toe
    },
    extends: [
      'plugin:vue/essential',
      'eslint:recommended'
    //   'plugin:jest/recommended'
    ],
    parserOptions: {
      ecmaVersion: 2020
    },
    // plugins: ['jest'], // Voeg Jest-plugin toe
    rules: {
      // Voeg hier je eigen regels toe als nodig
    }
  };
  