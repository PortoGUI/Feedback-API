import globals from 'globals'
import nPlugin from 'eslint-plugin-n'
import importPlugin from 'eslint-plugin-import'
import promisePlugin from 'eslint-plugin-promise'
import standardConfig from 'eslint-config-standard'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    },
    plugins: {
      n: nPlugin,
      import: importPlugin,
      promise: promisePlugin
    },
    rules: {
      ...standardConfig.rules,
      semi: ['error', 'never'],
      quotes: ['warn', 'single'],
      'space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'never'
      }]
    }
  }
]
