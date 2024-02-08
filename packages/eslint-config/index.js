module.exports = {
    extends: ['airbnb', 'airbnb/hooks', 'prettier', '@salutejs/eslint-config-base', 'plugin:salute-rules/all'],
    parser: '@typescript-eslint/parser',
    plugins: ['react'],
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
    },
    overrides: [
        {
            files: ['*.tsx?'],
            env: {
                browser: true,
            },
            globals: {
                window: true,
                document: true,
            },
        },
    ],
    settings: {
        react: {
            version: '16.13.1',
        },
    },
};
