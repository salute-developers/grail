import { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule } from "../utils.js";

type MessageIds = "useLazyInitialization";
type Options = [];

export default createRule<Options, MessageIds>({
  name: "prefer-lazy-state-initialization",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "enforce lazy initialization for function calls in useState.",
      recommended: true,
      requiresTypeChecking: false,
    },
    schema: [],
    messages: {
      useLazyInitialization:
        "Avoid calling function inside useState. Prefer lazy initialization.",
    },
  },
  defaultOptions: [],
  create(context) {
    let useStateCallExpression: TSESTree.CallExpression | null = null;
    let nestingLevel = 0;

    return {
      CallExpression(node: TSESTree.CallExpression) {
        if (
          node.callee.type === AST_NODE_TYPES.Identifier &&
          node.callee.name === "useState"
        ) {
          useStateCallExpression = node;
          return;
        }

        if (useStateCallExpression && nestingLevel === 0) {
          context.report({ node, messageId: "useLazyInitialization" });
        }
      },

      ":function"() {
        if (useStateCallExpression) {
          nestingLevel++;
        }
      },

      ":function:exit"() {
        if (useStateCallExpression) {
          nestingLevel--;
        }
      },

      "CallExpression:exit"(node: TSESTree.CallExpression) {
        if (node === useStateCallExpression) {
          useStateCallExpression = null;
        }
      },
    };
  },
});
