import { TSESTree } from "@typescript-eslint/utils";
import { isComponentName, getFunctionName } from "./rule-helpers.js";
import { createRule } from "../utils.js";

// taken from https://github.com/eslint-community/eslint-plugin-promise/tree/main
function hasPromiseCallback(node: TSESTree.Node): boolean {
  if (node.type !== TSESTree.AST_NODE_TYPES.CallExpression) return false;

  if (node.callee.type !== TSESTree.AST_NODE_TYPES.MemberExpression)
    return false;
  const propertyName =
    node.callee.property.type === TSESTree.AST_NODE_TYPES.Identifier
      ? node.callee.property.name
      : "";

  return (
    propertyName === "then" ||
    propertyName === "catch" ||
    propertyName === "finally"
  );
}

type MessageIds = "redundantCommit";
type Options = [];

export default createRule<Options, MessageIds>({
  name: "no-redundant-commit",
  meta: {
    type: "problem",
    docs: {
      description:
        "disallow synchronous setting of state in effect to prevent redundant commits",
      recommended: true,
      requiresTypeChecking: false,
    },
    schema: [],
    messages: {
      redundantCommit: "Avoid using synchronous state setters within effects",
    },
  },
  defaultOptions: [],
  create: (context) => {
    let isInUseEffect = false;
    let isInAsync = false;
    let asyncRoot: TSESTree.Node | null = null;
    let currentComponent: TSESTree.Node | null = null;
    let currentComponentStateSettersNames: string[] = [];
    let callExpressionNestingLevel = 0;
    let UseEffectFunctionsNestingLevel = 0;
    let currFunctionName: string | undefined;

    return {
      CallExpression(node: TSESTree.CallExpression) {
        callExpressionNestingLevel++;

        if (
          node.callee.type === TSESTree.AST_NODE_TYPES.Identifier &&
          currentComponentStateSettersNames.includes(node.callee.name) &&
          !isInAsync
        ) {
          if (
            isInUseEffect &&
            callExpressionNestingLevel === 2 && // function is called on the level of useEffect(()=> {'around here and not deeper' }, [])
            UseEffectFunctionsNestingLevel === 1
          ) {
            context.report({
              node,
              messageId: "redundantCommit",
            });
          } else if (currFunctionName) {
            // call is inside new function
            currentComponentStateSettersNames.push(currFunctionName);
          }
        }

        // Checking if the invoked function is useEffect
        if (
          node.callee.type === TSESTree.AST_NODE_TYPES.Identifier &&
          node.callee.name === "useEffect" &&
          currentComponent
        ) {
          isInUseEffect = true;
        }

        // Checking if the function call is useState
        if (
          node.callee.type === TSESTree.AST_NODE_TYPES.Identifier &&
          node.callee.name === "useState" &&
          currentComponent
        ) {
          const parent = node.parent;
          if (!parent) return;

          const isDestructuringDeclarator =
            parent.type === TSESTree.AST_NODE_TYPES.VariableDeclarator &&
            parent.id.type === TSESTree.AST_NODE_TYPES.ArrayPattern;

          if (!isDestructuringDeclarator) {
            return;
          }

          const variableNodes = (parent.id as TSESTree.ArrayPattern).elements;
          const setterVariable = variableNodes[1] as TSESTree.Identifier;
          if (setterVariable?.name) {
            currentComponentStateSettersNames.push(setterVariable.name);
          }
        }

        if (
          node.callee.type === TSESTree.AST_NODE_TYPES.Identifier &&
          (node.callee.name === "setTimeout" ||
            node.callee.name === "setInterval")
        ) {
          isInAsync = true;
        }

        if (hasPromiseCallback(node)) {
          if (!isInAsync) {
            asyncRoot = node;
            isInAsync = true;
          }
        }
      },

      "CallExpression:exit"(node: TSESTree.CallExpression) {
        callExpressionNestingLevel--;
        if (
          node.callee.type === TSESTree.AST_NODE_TYPES.Identifier &&
          node.callee.name === "useEffect"
        ) {
          isInUseEffect = false;
        }

        // The current implementation does not consider nested setTimeout calls.
        if (
          node.callee.type === TSESTree.AST_NODE_TYPES.Identifier &&
          (node.callee.name === "setTimeout" ||
            node.callee.name === "setInterval")
        ) {
          isInAsync = false;
        }

        if (hasPromiseCallback(node)) {
          if (asyncRoot === node) {
            isInAsync = false;
            asyncRoot = null;
          }
        }
      },

      ":function"(node: TSESTree.Node) {
        if ("async" in node && node.async) {
          isInAsync = true;
          return;
        }

        const name = getFunctionName(node);
        currFunctionName = name?.name;

        if (isInUseEffect) {
          UseEffectFunctionsNestingLevel++;
        }

        if (name && isComponentName(name)) {
          // We  doesn't consider nested component declaration
          currentComponent = node;
        }
      },

      ":function:exit"(node: TSESTree.Node) {
        if (node === currentComponent) {
          currentComponent = null;
          currentComponentStateSettersNames = [];
        }

        if (isInUseEffect) {
          UseEffectFunctionsNestingLevel--;
        }

        if ("async" in node && node.async) {
          isInAsync = false;
        }
      },
    };
  },
});
