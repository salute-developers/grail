"use strict";

module.exports = [
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: require("@typescript-eslint/parser"),
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
            import: require("eslint-plugin-import"),
        },
        rules: {
            "no-restricted-syntax": "off", // В for...of циклах ничего плохого нет
            "spaced-comment": ["error", "always", { markers: ["/"] }], // Разрешаем ts-require directive
            "comma-dangle": ["error", "always-multiline"],
            "arrow-parens": ["error", "always"],
            "space-before-function-paren": [
                "error",
                {
                    anonymous: "never",
                    named: "never",
                    asyncArrow: "always",
                },
            ],
            "max-len": [
                "error",
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
            "padding-line-between-statements": [
                "error",
                { blankLine: "always", prev: "*", next: "return" },
                { blankLine: "always", prev: "*", next: "if" },
            ],
            "no-plusplus": "off",
            "max-classes-per-file": "off",
            "operator-linebreak": "off",
            "object-curly-newline": "off",
            "class-methods-use-this": "off",
            "no-confusing-arrow": "off",
            "function-paren-newline": "off",
            "no-param-reassign": "off",
            "no-shadow": "warn",
            "consistent-return": "off",
            "arrow-body-style": "off",
            "no-unused-expressions": "off",

            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/explicit-function-return-type": "off",

            "import/prefer-default-export": "off",
            "import/order": [
                "error",
                {
                    groups: [["builtin", "external"], "internal", "parent", "sibling", "index"],
                    "newlines-between": "always",
                },
            ],
            "import/no-unresolved": "off",
            "import/extensions": "off",
            "import/no-extraneous-dependencies": ["off"],
        },
    },
];
