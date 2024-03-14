// The next function is taken form here
//  https://github.com/facebook/react/blob/main/packages/eslint-plugin-react-hooks/src/RulesOfHooks.js
/**
 * Gets the static name of a function AST node. For function declarations it is
 * easy. For anonymous function expressions it is much harder. If you search for
 * `IsAnonymousFunctionDefinition()` in the ECMAScript spec you'll find places
 * where JS gives anonymous function expressions names. We roughly detect the
 * same AST nodes with some exceptions to better fit our use case.
 */

function getFunctionName(node) {
    if (node.type === 'FunctionDeclaration' || (node.type === 'FunctionExpression' && node.id)) {
        // function useHook() {}
        // const whatever = function useHook() {};
        //
        // Function declaration or function expression names win over any
        // assignment statements or other renames.
        return node.id;
    }

    if (node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
        if (node.parent.type === 'VariableDeclarator' && node.parent.init === node) {
            // const useHook = () => {};
            return node.parent.id;
        }

        if (node.parent.type === 'AssignmentExpression' && node.parent.right === node && node.parent.operator === '=') {
            // useHook = () => {};
            return node.parent.left;
        }

        if (node.parent.type === 'Property' && node.parent.value === node && !node.parent.computed) {
            // {useHook: () => {}}
            // {useHook() {}}
            return node.parent.key;

            // NOTE: We could also support `ClassProperty` and `MethodDefinition`
            // here to be pedantic. However, hooks in a class are an anti-pattern. So
            // we don't allow it to error early.
            //
            // class {useHook = () => {}}
            // class {useHook() {}}
        }

        if (node.parent.type === 'AssignmentPattern' && node.parent.right === node && !node.parent.computed) {
            // const {useHook = () => {}} = {};
            // ({useHook = () => {}} = {});
            //
            // Kinda clowny, but we'd said we'd follow spec convention for
            // `IsAnonymousFunctionDefinition()` usage.
            return node.parent.left;
        }

        return undefined;
    }

    return undefined;
}

/**
 * Checks if the node is a React component name. React component names must
 * always start with an uppercase letter.
 */

function isComponentName(node) {
    return node.type === 'Identifier' && /^[A-Z]/.test(node.name);
}

exports.isComponentName = isComponentName;
exports.getFunctionName = getFunctionName;
