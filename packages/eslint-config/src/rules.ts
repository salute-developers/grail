import type { ESLint } from "eslint";

type Rules = ESLint.ConfigData["rules"];

const typescriptRules = {
  "@typescript-eslint/no-empty-function": "off",
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      args: "all",
      argsIgnorePattern: "^_",
      caughtErrors: "all",
      caughtErrorsIgnorePattern: "^_",
      destructuredArrayIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      ignoreRestSiblings: true,
    },
  ],
  "@typescript-eslint/no-unused-expressions": "off",
} as const satisfies Rules;

const importRules = {
  "import/prefer-default-export": "off", // @grape: https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/
  "import/order": [
    "error",
    {
      groups: [
        ["builtin", "external"],
        "internal",
        "parent",
        "sibling",
        "index",
      ],
      "newlines-between": "always",
    },
  ],
  "import/no-unresolved": "off",
  "import/extensions": "off",
  "import/no-extraneous-dependencies": ["off"],
} as const satisfies Rules;

const codeOrganizationRules = {
  "max-classes-per-file": "off",
  "no-restricted-syntax": "off", // Allow for...of loops
} as const satisfies Rules;

const codeFormattingRules = {
  "arrow-body-style": "off",
} as const satisfies Rules;

const bestPracticesRules = {
  "no-plusplus": "off",
  "class-methods-use-this": "off",
  "no-param-reassign": "off",
  "no-shadow": "warn",
  "consistent-return": "off",
  "no-unused-expressions": "off",
} as const satisfies Rules;

export const reactRules = {
  "react/prop-types": "off",
  "react-hooks/exhaustive-deps": "error",
} as const satisfies Rules;

export const saluteRules = {
  ...typescriptRules,
  ...importRules,
  ...codeOrganizationRules,
  ...codeFormattingRules,
  ...bestPracticesRules,
} as const satisfies Rules;
