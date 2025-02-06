import { rules } from "./rules.js";

export default {
  extends: [
    "eslint:recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:react-perf/recommended",
    // the following lines do the trick
    "plugin:import/typescript",
    "prettier",
  ],
  settings: {
    "import/resolver": {
      // You will also need to install and configure the TypeScript resolver
      // See also https://github.com/import-js/eslint-import-resolver-typescript#configuration
      typescript: true,
      node: true,
    },
  },
  rules,
};
