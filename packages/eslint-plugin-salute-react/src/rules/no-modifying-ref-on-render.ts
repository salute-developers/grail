import { TSESTree } from "@typescript-eslint/utils";
import { getFunctionName, isComponentName } from "./rule-helpers.js";
import { createRule } from "../utils.js";

type MessageIds = "noModifyingRefOnRender";

export default createRule<[], MessageIds>({
  name: "no-modifying-ref-on-render",
  meta: {
    type: "problem",
    docs: {
      description: "require ref.current to be read only",
      recommended: true,
      requiresTypeChecking: false,
    },
    schema: [],
    messages: {
      noModifyingRefOnRender: "Do not write ref.current during rendering",
    },
  },
  defaultOptions: [],
  create: (context) => {
    let isInUseEffect = false;
    let useCallbackNode: TSESTree.CallExpression | null = null;
    const functionNestingStack: TSESTree.Node[] = [];
    let currentComponent: TSESTree.Node | null = null;
    let currentComponentRefNames: string[] = [];
    const refModifyingFunctions: string[] = [];
    let nestingLevel = 0;

    return {
      CallExpression(node: TSESTree.CallExpression) {
        if (node.callee.type !== TSESTree.AST_NODE_TYPES.Identifier) {
          return;
        }
        const name = node.callee.name;

        if (name === "useRef") {
          const parent = node.parent;
          if (
            parent?.type === TSESTree.AST_NODE_TYPES.VariableDeclarator &&
            parent.id.type === TSESTree.AST_NODE_TYPES.Identifier
          ) {
            const refName = parent.id.name;
            currentComponentRefNames.push(refName);
          }
        }

        if (name === "useCallback") {
          useCallbackNode = node;
        }

        if (name === "useEffect") {
          isInUseEffect = true;
        }

        if (
          refModifyingFunctions.includes(name) &&
          nestingLevel === 0 &&
          currentComponent
        ) {
          context.report({
            node,
            messageId: "noModifyingRefOnRender",
          });
        }
      },
      "CallExpression:exit"(node: TSESTree.CallExpression) {
        if (
          node.callee.type === TSESTree.AST_NODE_TYPES.Identifier &&
          node.callee.name === "useEffect"
        ) {
          isInUseEffect = false;
        }

        if (
          node.callee.type === TSESTree.AST_NODE_TYPES.Identifier &&
          node.callee.name === "useCallback"
        ) {
          useCallbackNode = null;
        }
      },

      ":function"(node: TSESTree.Node) {
        if (currentComponent) {
          nestingLevel++;
          functionNestingStack.push(node);
        }
        const name = getFunctionName(node);

        if (name && isComponentName(name)) {
          currentComponent = node;
        }
      },

      ":function:exit"(node: TSESTree.Node) {
        if (node === currentComponent) {
          currentComponent = null;
          currentComponentRefNames = [];
          nestingLevel = 0;
        } else if (currentComponent) {
          nestingLevel--;
          functionNestingStack.pop();
        }
      },

      "AssignmentExpression > MemberExpression"(
        node: TSESTree.MemberExpression,
      ) {
        if (
          node.object.type === TSESTree.AST_NODE_TYPES.Identifier &&
          currentComponentRefNames.includes(node.object.name) &&
          node.property.type === TSESTree.AST_NODE_TYPES.Identifier &&
          node.property.name === "current" &&
          !isInUseEffect
        ) {
          if (nestingLevel === 0 && currentComponent) {
            context.report({
              node,
              messageId: "noModifyingRefOnRender",
            });
          } else {
            if (useCallbackNode) {
              const parent = useCallbackNode.parent;
              if (
                parent?.type === TSESTree.AST_NODE_TYPES.VariableDeclarator &&
                parent.id.type === TSESTree.AST_NODE_TYPES.Identifier
              ) {
                const callbackName = parent.id.name;
                refModifyingFunctions.push(callbackName);
              }
            } else {
              const currFunction = functionNestingStack.at(-1);
              const name = getFunctionName(currFunction);
              if (name?.name) {
                refModifyingFunctions.push(name.name);
              }
            }
          }
        }
      },
    };
  },
});
