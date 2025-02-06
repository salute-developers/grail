import type { ESLint } from "eslint";

type Rules = ESLint.ConfigData["rules"];

const typescriptRules = {
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
} as const satisfies Rules;

const importRules = {
    "import/prefer-default-export": "off", // @grape: https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/
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
} as const satisfies Rules;

const codeStyleRules = {
    "spaced-comment": ["error", "always", { markers: ["/"] }], // Allow ts-require directive
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
    indent: "off",
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
} as const satisfies Rules;

const codeOrganizationRules = {
    "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: "*", next: "if" },
    ],
    "max-classes-per-file": "off",
    "no-restricted-syntax": "off", // Allow for...of loops
} as const satisfies Rules;

const codeFormattingRules = {
    "implicit-arrow-linebreak": "off",
    "operator-linebreak": "off",
    "object-curly-newline": "off",
    "function-paren-newline": "off",
    "arrow-body-style": "off",
} as const satisfies Rules;

const bestPracticesRules = {
    "no-plusplus": "off",
    "class-methods-use-this": "off",
    "no-confusing-arrow": "off",
    "no-param-reassign": "off",
    "no-shadow": "warn",
    "consistent-return": "off",
    "no-unused-expressions": "off",
} as const satisfies Rules;

export const rules = {
    ...typescriptRules,
    ...importRules,
    ...codeStyleRules,
    ...codeOrganizationRules,
    ...codeFormattingRules,
    ...bestPracticesRules,
} as const satisfies Rules;
