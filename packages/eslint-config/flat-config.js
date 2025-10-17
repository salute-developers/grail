import 'eslint-plugin-only-warn';
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintReact from '@eslint-react/eslint-plugin';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactCompiler from 'eslint-plugin-react-compiler';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginSonarJs from 'eslint-plugin-sonarjs';
import eslintPluginDeMorgan from 'eslint-plugin-de-morgan';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import { globalIgnores, defineConfig } from 'eslint/config';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pluginNext = require('@next/eslint-plugin-next');

export default defineConfig([
    globalIgnores(['.next', 'node_modules', 'next-env.d.ts']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
            reactHooks.configs['recommended-latest'],
            reactRefresh.configs.vite,
            reactCompiler.configs.recommended,
            eslintPluginUnicorn.configs.recommended,
            eslintReact.configs['recommended-type-checked'],
            jsxA11y.flatConfigs.strict,
            eslintPluginSonarJs.configs.recommended,
            eslintPluginDeMorgan.configs.recommended,
            pluginNext.flatConfig.recommended,
            pluginNext.flatConfig.coreWebVitals,
        ],
        languageOptions: {
            ecmaVersion: 2022,
            globals: globals.browser,
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            curly: 'warn',
            eqeqeq: 'warn',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/no-null': 'off',
            'unicorn/no-useless-undefined': 'off',
            'react-refresh/only-export-components': 'off',
            'unicorn/no-typeof-undefined': ['error', { checkGlobalVariables: true }],
            'react-hooks/exhaustive-deps': [
                'warn',
                {
                    additionalHooks: '(useIsomorphicEffect)',
                },
            ],
            '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
            '@typescript-eslint/no-invalid-void-type': 'off',
            '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
            '@typescript-eslint/dot-notation': ['error', { allowIndexSignaturePropertyAccess: true }],
            'sonarjs/function-return-type': 'off',
            'sonarjs/different-types-comparison': 'off',
            'sonarjs/cognitive-complexity': 'off',
        },
    },
]);
