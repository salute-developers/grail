const eslintPluginExample = require("./rules/eslint-plugin-example");

module.exports = {
    // extends: [
    //     'airbnb',
    //     'airbnb/hooks',
    //     'prettier',
    //     '@salutejs/eslint-config-base',
    // ],
    // parser: '@typescript-eslint/parser',
    plugins: { example: eslintPluginExample },
    rules: {
        "example/enforce-foo-bar": "error",
        // 'react/prop-types': 'off',
        // 'react/static-property-placement': 'off',
        // 'react/state-in-constructor': 'off',
        // 'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
        // 'react/jsx-one-expression-per-line': 'off',
        // 'react/jsx-indent': ['error', 4],
        // 'react/jsx-indent-props': ['error', 4],
        // 'react/display-name': 'error',
        // 'react/jsx-no-leaked-render': 'error',
        // 'react/jsx-props-no-spreading': 'off',
        // 'react/destructuring-assignment': 'off',
        // 'react/sort-comp': 'off',
        // 'react/no-array-index-key': 'off',
        // 'react/require-default-props': 'off',
        // 'react/function-component-definition': 'off',
        // 'react/jsx-no-useless-fragment': 'off',
        // 'react/no-unstable-nested-components': 'error',

        // 'jsx-a11y/no-static-element-interactions': 'off',
        // 'jsx-a11y/click-events-have-key-events': 'off',
        // 'jsx-a11y/no-noninteractive-tabindex': 'off',

        // 'no-restricted-imports': [
        //     'error',
        //     {
        //         patterns: [
        //             '@salutejs/plasma-ui/*',
        //             '@salutejs/plasma-tokens/*',
        //             '@salutejs/plasma-icons/*',
        //             '@salutejs/plasma-web/*',
        //             '@salutejs/plasma-b2c/*'
        //         ],
        //     },
        // ],

        "no-restricted-syntax": [
            "error",
            {
                selector:
                    "CallExpression[callee.name = useMemo] :matches(ArrowFunctionExpression, ArrowFunctionExpression ReturnStatement, FunctionExpression ReturnStatement) :matches(TemplateLiteral[expressions.length = 0], TemplateLiteral > Identifier, TemplateLiteral > Literal)",
                message:
                    "Do not memorize primitives https://dev.to/katekate/another-react-dos-and-donts-4ba0#:~:text=1.2.%20Avoid%20useMemo%20for%20primitive%20memoization.",
            },
            {
                selector:
                    "CallExpression[callee.name = useMemo] :matches(ArrowFunctionExpression, ArrowFunctionExpression ReturnStatement, FunctionExpression ReturnStatement) > Literal",
                message:
                    "Do not memorize primitives https://dev.to/katekate/another-react-dos-and-donts-4ba0#:~:text=1.2.%20Avoid%20useMemo%20for%20primitive%20memoization.",
            },
        ],

        "default-param-last": "warn",

        // '@typescript-eslint/member-ordering': [
        //     'warn',
        //     {
        //         default: {
        //             optionalityOrder: 'required-first',
        //         },
        //     },
        // ],
    },
    // overrides: [
    //     {
    //         files: ['*.tsx?'],
    //         env: {
    //             browser: true,
    //         },
    //         globals: {
    //             window: true,
    //             document: true,
    //         },
    //     }
    // ],
    settings: {
        react: {
            version: "16.13.1",
        },
    },
};
