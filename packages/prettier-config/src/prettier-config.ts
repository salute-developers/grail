import { Config } from "prettier";

export default {
  arrowParens: "always",
  printWidth: 120,
  bracketSameLine: false,
  jsxSingleQuote: false,
  endOfLine: "auto",
  semi: true,
  singleQuote: true,
  tabWidth: 4,
  trailingComma: "all",
  plugins: ["prettier-plugin-packagejson"],
  overrides: [
    {
      files: ["*.json"],
      options: {
        tabWidth: 2,
      },
    },
    {
      files: ["*.yml", "*.yaml"],
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
} as const satisfies Config;
