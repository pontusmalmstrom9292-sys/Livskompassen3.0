import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const noBtnPillInModulesRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Warn on new btn-pill-- usage inside src/modules',
    },
    schema: [],
    messages: {
      forbidden: 'Use ds-btn instead of btn-pill-- in src/modules.',
    },
  },
  create(context) {
    const filename = (context.filename ?? context.getFilename?.() ?? '').replace(/\\/g, '/')
    if (!filename.includes('/src/modules/')) {
      return {}
    }

    return {
      Literal(node) {
        if (typeof node.value === 'string' && node.value.includes('btn-pill--')) {
          context.report({ node, messageId: 'forbidden' })
        }
      },
      TemplateLiteral(node) {
        if (node.quasis.some((quasi) => quasi.value.raw.includes('btn-pill--'))) {
          context.report({ node, messageId: 'forbidden' })
        }
      },
    }
  },
}

export default defineConfig([
  globalIgnores([
    'dist',
    'android/**',
    'docs/archive/**',
    'functions/lib/**',
    '.orkester/runs/**',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      local: {
        rules: {
          'no-btn-pill-in-modules': noBtnPillInModulesRule,
        },
      },
    },
    rules: {
      // Existing patterns (data fetch on mount, vault lock reset) — fix incrementally
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/purity': 'off',
      'react-refresh/only-export-components': 'off',
      'preserve-caught-error': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'local/no-btn-pill-in-modules': 'warn',
    },
  },
])
