'use strict';

import eslintRecommended from '@eslint/js';
import tsEslintRecommended from '@typescript-eslint/eslint-plugin';
import tsEslintParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

/** @type {import("eslint").Linter.Config[]} */
export default [
    {
        files: ['*.ts', '*.tsx'],
        languageOptions: {
            parser: tsEslintParser,
        },
        plugins: {
            '@typescript-eslint': tsEslintRecommended,
            import: importPlugin,
        },
        rules: {
            ...eslintRecommended.configs.recommended.rules,
            ...tsEslintRecommended.configs['eslint-recommended'].rules,
            ...tsEslintRecommended.configs.recommended.rules,
            ...importPlugin.configs.recommended.rules,

            '@typescript-eslint/no-empty-function': 'off',
            'no-restricted-syntax': 'off', // В for...of циклах ничего плохого нет
            'spaced-comment': ['error', 'always', { markers: ['/'] }], // разрешаем ts-require directive
            'comma-dangle': ['error', 'always-multiline'],
            'arrow-parens': ['error', 'always'],

            'space-before-function-paren': [
                'error',
                {
                    anonymous: 'never',
                    named: 'never',
                    asyncArrow: 'always',
                },
            ],
            indent: 'off',
            'max-len': [
                'error',
                120,
                2,
                {
                    ignoreUrls: true,
                    ignoreComments: false,
                    ignoreRegExpLiterals: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                },
            ],
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: '*', next: 'return' },
                { blankLine: 'always', prev: '*', next: 'if' },
            ],
            'implicit-arrow-linebreak': 'off',
            'no-plusplus': 'off',
            'max-classes-per-file': 'off',
            'operator-linebreak': 'off',
            'object-curly-newline': 'off',
            'class-methods-use-this': 'off',
            'no-confusing-arrow': 'off',
            'function-paren-newline': 'off',
            'no-param-reassign': 'off',
            'no-shadow': 'warn',
            'consistent-return': 'off',

            '@typescript-eslint/explicit-function-return-type': 'off',

            'import/prefer-default-export': 'off', // @grape: https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/
            'import/order': [
                'error',
                {
                    groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
                    'newlines-between': 'always',
                },
            ],
            'import/no-unresolved': 'off',
            'import/extensions': 'off',
            'import/no-extraneous-dependencies': ['off'],
            'arrow-body-style': 'off',
            'no-unused-expressions': 'off',
        },
    },
];
