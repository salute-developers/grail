import { TSESTree, AST_NODE_TYPES } from "@typescript-eslint/utils";
import { createRule } from "../utils.js";

type MessageIds = "noMemoizedPrimitives";
type Options = [];

export default createRule<Options, MessageIds>({
  name: "no-memoized-primitives",
  meta: {
    type: "problem",
    docs: {
      description: "disallow memoization of primitives",
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      noMemoizedPrimitives: "Do not memoize primitives",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    let currentUseMemoNode: TSESTree.CallExpression | null = null;
    let nestingLevel = 0;

    return {
      CallExpression(node: TSESTree.CallExpression) {
        if (
          node.callee.type === AST_NODE_TYPES.Identifier &&
          node.callee.name === "useMemo"
        ) {
          currentUseMemoNode = node;
        }
      },
      "CallExpression:exit"(node: TSESTree.CallExpression) {
        if (node === currentUseMemoNode) {
          currentUseMemoNode = null;
        }
      },
      ":function"() {
        nestingLevel++;
      },
      ":function:exit"() {
        nestingLevel--;
      },
      ":matches(ArrowFunctionExpression, ReturnStatement) > BinaryExpression"(
        node: TSESTree.BinaryExpression,
      ) {
        if (currentUseMemoNode && nestingLevel === 1) {
          context.report({
            node,
            messageId: "noMemoizedPrimitives",
          });
        }
      },
      ":matches(ArrowFunctionExpression, ReturnStatement) > ConditionalExpression > Literal"(
        node: TSESTree.Literal,
      ) {
        if (currentUseMemoNode && nestingLevel === 1) {
          context.report({
            node,
            messageId: "noMemoizedPrimitives",
          });
        }
      },
      ":matches(ArrowFunctionExpression, ReturnStatement) > TemplateLiteral"(
        node: TSESTree.TemplateLiteral,
      ) {
        if (
          currentUseMemoNode &&
          nestingLevel === 1 &&
          node.expressions.length === 0
        ) {
          context.report({
            node,
            messageId: "noMemoizedPrimitives",
          });
        }
      },
      ":matches(ArrowFunctionExpression, ReturnStatement) > TemplateLiteral > :matches(Literal, Identifier)"(
        node: TSESTree.Literal | TSESTree.Identifier,
      ) {
        if (currentUseMemoNode && nestingLevel === 1) {
          context.report({
            node,
            messageId: "noMemoizedPrimitives",
          });
        }
      },
      ":matches(ArrowFunctionExpression, ReturnStatement) > Literal"(
        node: TSESTree.Literal,
      ) {
        if ("name" in node && node.name === "undefined") {
          return;
        }

        if (node.raw === "null") {
          return;
        }

        if (currentUseMemoNode && nestingLevel === 1) {
          context.report({
            node,
            messageId: "noMemoizedPrimitives",
          });
        }
      },
    };
  },
});
