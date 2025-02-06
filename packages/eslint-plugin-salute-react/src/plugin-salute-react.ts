import { createRequire } from "node:module";
import { rules } from "./rules/index.js";

import { TSESLint } from "@typescript-eslint/utils";

const requirePackageJson = createRequire(import.meta.url);

const { name, version } =
  // `importing here would bypass the TSConfig's `"rootDir": "src"`
  requirePackageJson("../../package.json") as typeof import("../package.json");

const plugin = {
  configs: {
    get recommended() {
      return recommended;
    },
  },
  meta: {
    name,
    version,
  },
  rules,
};

const recommended: TSESLint.FlatConfig.Config = {
  plugins: {
    "salute-react": plugin,
  },
  rules: {
    "salute-react/no-memoized-primitives": "error",
    "salute-react/no-modifying-ref-on-render": "error",
    "salute-react/no-redundant-commit": "error",
    "salute-react/prefer-lazy-state-initialization": "error",
  },
  files: ["**/*.{ts,tsx}"],
  name: "salute-react",
};

export default plugin;
