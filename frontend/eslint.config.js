import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.vitest },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // catches unused vars/imports, ignores constants like SOME_CONST
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],

      // forces == to be ===, catching subtle type-coercion bugs
      eqeqeq: 'error',

      // disallows var, forces let/const
      'no-var': 'error',

      // prefers const when a variable is never reassigned
      'prefer-const': 'error',

      // catches array callbacks like .map() that look like they return
      // a value (arrow with braces) but don't
      'array-callback-return': 'error',

      // flags accidental console.log left in code (warn, not error,
      // since you'll use it constantly while debugging)
      'no-console': 'warn',

      // disallows reassigning function parameters (helps catch
      // accidental mutation of props/args)
      'no-param-reassign': ['error', { props: true }],

      // requires curly braces for all control statements (if/for/while)
      curly: ['error', 'all'],

      // catches duplicate object keys/imports
      'no-duplicate-imports': 'error',
    },
  },
  prettierConfig,
]
