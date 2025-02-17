import { TSESTree } from "@typescript-eslint/utils";

/**
 * Gets the static name of a function AST node. For function declarations it is
 * easy. For anonymous function expressions it is much harder. If you search for
 * `IsAnonymousFunctionDefinition()` in the ECMAScript spec you'll find places
 * where JS gives anonymous function expressions names. We roughly detect the
 * same AST nodes with some exceptions to better fit our use case.
 */
export function getFunctionName(
  node: TSESTree.Node | null | undefined,
): TSESTree.Identifier | undefined {
  if (!node) return undefined;

  if (
    (node.type === TSESTree.AST_NODE_TYPES.FunctionDeclaration ||
      node.type === TSESTree.AST_NODE_TYPES.FunctionExpression) &&
    node.id
  ) {
    // function useHook() {}
    // const whatever = function useHook() {};
    return node.id;
  }

  if (
    node.type === TSESTree.AST_NODE_TYPES.FunctionExpression ||
    node.type === TSESTree.AST_NODE_TYPES.ArrowFunctionExpression
  ) {
    if (
      node.parent?.type === TSESTree.AST_NODE_TYPES.VariableDeclarator &&
      node.parent.init === node &&
      node.parent.id.type === TSESTree.AST_NODE_TYPES.Identifier
    ) {
      // const useHook = () => {};
      return node.parent.id;
    }

    if (
      node.parent?.type === TSESTree.AST_NODE_TYPES.AssignmentExpression &&
      node.parent.right === node &&
      node.parent.operator === "=" &&
      node.parent.left.type === TSESTree.AST_NODE_TYPES.Identifier
    ) {
      // useHook = () => {};
      return node.parent.left;
    }

    if (
      node.parent?.type === TSESTree.AST_NODE_TYPES.Property &&
      node.parent.value === node &&
      !node.parent.computed &&
      node.parent.key.type === TSESTree.AST_NODE_TYPES.Identifier
    ) {
      // {useHook: () => {}}
      // {useHook() {}}
      return node.parent.key;
    }

    if (
      node.parent?.type === TSESTree.AST_NODE_TYPES.AssignmentPattern &&
      node.parent.right === node &&
      node.parent.left.type === TSESTree.AST_NODE_TYPES.Identifier
    ) {
      // const {useHook = () => {}} = {};
      // ({useHook = () => {}} = {});
      return node.parent.left;
    }
  }

  return undefined;
}

/**
 * Checks if the node is a React component name. React component names must
 * always start with an uppercase letter.
 */
export function isComponentName(node: TSESTree.Identifier): boolean {
  return /^[A-Z]/.test(node.name);
}
