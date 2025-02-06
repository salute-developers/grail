import { ESLintUtils } from "@typescript-eslint/utils";

export interface LintingRuleDocs {
  description: string;
  recommended?: boolean;
  requiresTypeChecking?: boolean;
}

const rulesUrls: Record<string, string> = {
  "no-modifying-ref-on-render":
    "https://react.dev/reference/react/useRef#caveats",
  "no-redundant-commit":
    "https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes",
  "prefer-lazy-state-initialization":
    "https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state",
  "no-memoized-primitives":
    "https://dev.to/katekate/another-react-dos-and-donts-4ba0#12-dont-use-raw-usememo-endraw-for-primitive-memoization",
};

export const createRule = ESLintUtils.RuleCreator<LintingRuleDocs>(
  (name) => rulesUrls[name] ?? "",
);
