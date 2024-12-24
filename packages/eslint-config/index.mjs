"use strict"

import eslintConfigBase from '@salutejs/eslint-config-base';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactPerfPlugin from 'eslint-plugin-react-perf';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import saluteRulesPlugin from 'eslint-plugin-salute-rules';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from '@salutejs/prettier-config';

/** @type {import("eslint").Linter.Config[]} */
export default [
    eslintConfigBase,
    reactPlugin.configs.recommended,
    reactHooksPlugin.configs.recommended,
    reactPerfPlugin.configs.recommended,
    jsxA11yPlugin.configs.recommended,
    saluteRulesPlugin.configs.all,
    prettierPlugin.configs.recommended,
    {
        rules: {
            'react/prop-types': 'off',
            'react/static-property-placement': 'off',
            'react/state-in-constructor': 'off',
            'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
            'react/jsx-one-expression-per-line': 'off',
            'react/jsx-indent': ['error', 4],
            'react/jsx-indent-props': ['error', 4],
            'react/display-name': 'error',
            'react/jsx-no-leaked-render': 'off',
            'react/jsx-props-no-spreading': 'off',
            'react/destructuring-assignment': 'off',
            'react/sort-comp': 'off',
            'react/no-array-index-key': 'off',
            'react/require-default-props': 'off',
            'react/function-component-definition': 'off',
            'react/jsx-no-useless-fragment': 'off',
            'react/no-unstable-nested-components': 'error',

            'jsx-a11y/no-static-element-interactions': 'off',
            'jsx-a11y/click-events-have-key-events': 'off',
            'jsx-a11y/no-noninteractive-tabindex': 'off',

            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        '@salutejs/plasma-ui/*',
                        '@salutejs/plasma-tokens/*',
                        '@salutejs/plasma-icons/*',
                        '@salutejs/plasma-web/*',
                        '@salutejs/plasma-b2c/*',
                    ],
                },
            ],

            'default-param-last': 'warn',

            '@typescript-eslint/member-ordering': [
                'warn',
                {
                    default: {
                        optionalityOrder: 'required-first',
                    },
                },
            ],
            'prettier/prettier': ['error', prettierConfig],
        },
        overrides: [
            {
                files: ['*.tsx?'],
                languageOptions: {
                    globals: {
                        window: true,
                        document: true,
                    },
                },
                rules: {
                    'react/no-unknown-property': 'error',
                },
            },
        ],
        settings: {
            react: {
                version: '18.3.1',
            },
        },
    },
];
