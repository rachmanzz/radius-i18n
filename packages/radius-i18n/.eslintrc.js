module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    env: {
      node: true,
      es6: true
    },
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  };
  