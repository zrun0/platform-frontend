import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  // 1. Base JS rules
  js.configs.recommended,

  // 2. Global environment configuration (using globals package)
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },

  // 3. TypeScript configuration (using typescript-eslint 8.x helper)
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
  })),

  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Disable no-undef for TypeScript files (the compiler handles this)
      'no-undef': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // 4. React configuration
  {
    files: ['**/*.jsx', '**/*.tsx'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // 5. General rules (not covered by oxlint)
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // 6. Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/out/**',
      '**/build/**',
      '**/*.generated.*',
      '**/*.d.ts',
      '**/.turbo/**',
      '**/coverage/**',
      '**/.nyc_output/**',
      '.vscode/**',
      '.idea/**',
      '**/.env.*',
    ],
  },
];
