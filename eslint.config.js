// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import hooksPlugin from 'eslint-plugin-react-hooks'

export default tseslint.config(
  {
    ignores: ["*.js"],
  },
  eslint.configs.recommended,
  // { rules: { semi: ["error", "always"] }},
  ...tseslint.configs.recommended,
  // ...tseslint.configs.recommendedTypeChecked,
  // ...tseslint.configs.stylisticTypeChecked,
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