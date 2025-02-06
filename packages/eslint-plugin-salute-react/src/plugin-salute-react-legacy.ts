import { rules } from "./rules/index.js";

export default {
  rules,
  configs: {
    recommended: {
      plugins: ["salute-react"],
      rules: {
        "salute-react/no-memoized-primitives": "error",
        "salute-react/no-modifying-ref-on-render": "error",
        "salute-react/no-redundant-commit": "error",
        "salute-react/prefer-lazy-state-initialization": "error",
      },
    },
  },
};
