const js = require('@eslint/js');

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  js.configs.recommended,

  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'package.json',
      'package-lock.json',
      '*.json'
    ]
  },

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs', // 👈 porque usas require/module.exports
      globals: {
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        process: 'readonly'
      }
    }
  },

  {
    files: ['**/*.test.js', 'tests/**/*.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        beforeEach: 'readonly'
      }
    }
  }
];
