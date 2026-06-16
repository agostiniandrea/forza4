import tsParser from '@typescript-eslint/parser'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import reactPlugin from 'eslint-plugin-react'
import nextPlugin from '@next/eslint-plugin-next'
import js from '@eslint/js'

const TS_FILES = ['**/*.ts', '**/*.tsx']

const eslintConfig = [
  js.configs.recommended,
  {
    languageOptions: { parser: tsParser, sourceType: 'module' },
    settings: { react: { version: '19.2.7' } },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
  ...typescriptEslint.configs['flat/recommended'].map((config) => ({
    ...config,
    files: TS_FILES,
  })),
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  reactHooks.configs.flat['recommended-latest'],
  nextPlugin.configs.recommended,
  nextPlugin.configs['core-web-vitals'],
  {
    files: TS_FILES,
    rules: {
      'react/prop-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    ignores: ['**/.next', '**/node_modules'],
  },
]

export default eslintConfig
