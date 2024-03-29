// @ts-nocheck

import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import hooksPlugin from 'eslint-plugin-react-hooks'

export default tseslint.config(
  {
    ignores: ["*.js", "dist/*"],
  },
  eslint.configs.recommended,
  stylistic.configs.customize({ quoteProps: 'as-needed', braceStyle: '1tbs', commaDangle: 'only-multiline' }),
  {
    rules: {
      '@stylistic/no-multiple-empty-lines': 'off',
      '@stylistic/jsx-one-expression-per-line': 'off',
      '@stylistic/jsx-closing-tag-location': 'off',
      '@stylistic/padded-blocks': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/max-statements-per-line': ['error', { max: 2 }],
    }
  },
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    rules: {
      "@typescript-eslint/array-type": ["error", { default: 'array-simple' }],
      '@typescript-eslint/restrict-template-expressions': ['error', {
        allowAny: false,
        allowBoolean: false,
        allowNullish: false,
        allowNumber: true,
        allowRegExp: false,
        allowNever: false,
      }],
      "@typescript-eslint/no-shadow": ["error", { ignoreTypeValueShadow: false }],
    }
  },
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    ...reactRecommended,
    settings: {
      react: {
        version: 'detect',
      }
    }
  },
  {
    plugins: {
      "react-hooks": hooksPlugin,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    }
  },
  // {
  //   files: ['*.js'],
  //   extends: [tseslint.configs.disableTypeChecked],
  // },
);