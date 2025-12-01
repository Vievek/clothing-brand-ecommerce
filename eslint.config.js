// eslint.config.js - Complete migration from .eslintrc.js
import js from '@eslint/js';
import globals from 'globals';

export default [
  // Base JS configuration
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
      },
    },
    rules: {
      // Code quality and complexity rules
      'max-lines-per-function': [
        'error',
        {
          max: 30,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-lines': [
        'error',
        {
          max: 200,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-depth': ['error', 3],
      'max-params': ['error', 4],
      complexity: ['error', 10],

      // Code style and best practices
      'no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1, 2],
          ignoreArrayIndexes: true,
          enforceConst: true,
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'SwitchStatement[cases.length>5]',
          message:
            'Long switch statement - Use polymorphism instead to follow Open/Closed Principle',
        },
        {
          selector: 'IfStatement > IfStatement > IfStatement',
          message:
            'Deeply nested if statements - Use guard clauses or extract conditions',
        },
        {
          selector:
            "IfStatement:has(Alternate[type='IfStatement']):has(Alternate[type='IfStatement']):has(Alternate[type='IfStatement'])",
          message:
            'Long if-else-if chain (4+ levels) - Consider using polymorphism, lookup tables, or extract to separate validation/decision functions',
        },
        {
          selector: 'ForStatement',
          message:
            'Avoid for loops - Use functional array methods like .map(), .filter(), .reduce()',
        },
        {
          selector: 'ForInStatement',
          message:
            'Avoid for...in loops - Use Object.keys/values/entries with .forEach()',
        },
        {
          selector: 'WhileStatement, DoWhileStatement',
          message:
            'Avoid while loops - Use functional array methods or recursion',
        },
      ],

      // Import/export rules
      'no-duplicate-imports': 'error',

      // Variable rules
      'no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',

      // Safety rules
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',

      // Structure rules
      'max-classes-per-file': ['error', 1],
      'max-nested-callbacks': ['error', 2],

      // Modern JS preferences
      'prefer-const': 'error',
      'no-useless-constructor': 'error',
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',
      'consistent-return': 'error',
      'default-param-last': 'error',
      'dot-notation': 'error',
      eqeqeq: ['error', 'always'],
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-template': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'no-else-return': 'error',
      'no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      'no-underscore-dangle': 'warn',
      'no-duplicate-case': 'error',
      'no-var': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: true,
          object: true,
        },
      ],
      'no-multiple-empty-lines': ['error', { max: 2 }],
      'prefer-object-spread': 'error',
      'no-return-assign': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',

      // Additional rules from your original config that were missing:
      'no-unreachable': 'error',
      'no-constant-condition': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-obj-calls': 'error',
      'no-sparse-arrays': 'error',
      'no-unexpected-multiline': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',
      curly: ['error', 'all'],
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      'no-unneeded-ternary': 'error',
      'one-var': ['error', 'never'],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-spacing': ['error', { before: false, after: true }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'space-before-blocks': ['error', 'always'],
      'space-before-function-paren': [
        'error',
        { anonymous: 'always', named: 'never', asyncArrow: 'always' },
      ],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'arrow-spacing': 'error',
    },
  },

  // Test files override
  {
    files: ['**/*.test.*', '**/*.spec.*', '**/test/**'],
    rules: {
      'max-lines-per-function': 'off',
      'max-lines': 'off',
      'max-params': ['warn', 6],
      'max-depth': ['warn', 4],
      'no-console': 'off',
      'no-magic-numbers': 'off',
      'max-classes-per-file': 'off',
      'no-restricted-syntax': 'off',
      // Relaxed rules for tests
      'no-unused-expressions': 'off',
      'max-nested-callbacks': 'off',
    },
  },

  // Config files override
  {
    files: ['*.config.*', '.*rc.*', '**/config/**'],
    rules: {
      'no-console': 'off',
      'no-magic-numbers': 'off',
      'max-classes-per-file': 'off',
      'no-restricted-syntax': 'off',
      // Relaxed rules for config files
      'import/no-commonjs': 'off',
      'global-require': 'off',
    },
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/',
      'backend/dist/',
      'backend/build/',
      'frontend/dist/',
      'frontend/build/',
      'coverage/',
      '*.config.js',
      'backend/.env',
      'frontend/.env',
      'dist/',
      'build/',
      '.nyc_output/',
      '*.min.js',
    ],
  },
];
