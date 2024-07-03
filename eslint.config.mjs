/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable import-x/no-named-as-default-member */

import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import reactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js'
import hooksPlugin from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import barrel from 'eslint-plugin-barrel-files'
import importPlugin from 'eslint-plugin-import-x'
import { fixupPluginRules } from '@eslint/compat'

// https://github.com/facebook/react/issues/28313
const hooksFlat = /** @type {const} */({
  plugins: {
    'react-hooks': {
      rules: fixupPluginRules(hooksPlugin).rules,
    },
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
})

// https://github.com/eslint-stylistic/eslint-stylistic/blob/main/packages/eslint-plugin/configs/customize.ts
const stylisticCustomized = stylistic.configs.customize({
  flat: true,
  quoteProps: 'as-needed',
  braceStyle: '1tbs',
  commaDangle: 'only-multiline',
})

const config = tseslint.config(
  { ignores: ['dist/*'] },
  eslint.configs.recommended,
  {
    name: 'stylistic',
    extends: [stylisticCustomized],
    rules: {
      '@stylistic/no-multiple-empty-lines': 'off',
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/jsx-closing-tag-location': 'off',
      '@stylistic/padded-blocks': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/max-statements-per-line': ['error', { max: 2 }],
      '@stylistic/operator-linebreak': 'off',
    },
  },
  {
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        // project: ['./tsconfig.json', './tsconfig.node.json'],
      },
    },
    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowAny: false,
          allowBoolean: false,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false,
          allowNever: false,
        },
      ],
      '@typescript-eslint/no-shadow': ['error', { ignoreTypeValueShadow: false }],
      '@typescript-eslint/no-restricted-imports': ['error', { patterns: ['**/index*'] }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
  {
    name: 'react plugin',
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    extends: [reactRecommended, reactJsxRuntime],
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  hooksFlat,
  {
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    plugins: {
      'barrel-files': { rules: barrel.rules },
    },
    rules: {
      'barrel-files/avoid-barrel-files': 'error',
      // disable because is OK to not treeshake local spotify lib.
      // 'barrel-files/avoid-namespace-import': 'error',
      'barrel-files/avoid-re-export-all': 'error',
    },
  },
  {
    plugins: {
      'import-x': { rules: importPlugin.rules },
    },
    settings: {
      // ...importPlugin.configs.typescript.settings,
      //  Parse errors in imported module '@spotify/web-api-ts-sdk': parserPath or languageOptions.parser is required
      'import-x/external-module-folders': ['node_modules', 'node_modules/@types'],
      // 'import-x/extensions': [".ts", ".tsx", ".js", ".jsx"],
      'import-x/extensions': ['.ts', '.tsx', '.cts', '.mts', '.js', '.jsx'],
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.cts', '.mts'],
      },
      'import-x/resolver': {
        // ...importPlugin.configs.typescript.settings['import-x/resolver'],
        typescript: {
          alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
          project: './tsconfig.json',
          // extensions: [".ts", ".tsx", ".js", ".jsx"],
        },
        node: {
          // extensions: [".ts", ".tsx", ".js", ".jsx"],
          extensions: ['.ts', '.tsx', '.cts', '.mts', '.js', '.jsx'],
        },
      },
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      'import-x/namespace': 'off', // not supported by flat config format
      'import-x/extensions': ['error', 'always', { ignorePackages: true }],
    },
  },
  { files: ['*.js'], extends: [tseslint.configs.disableTypeChecked] },
)

// console.log(config)
export default config
