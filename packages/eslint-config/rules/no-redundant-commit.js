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

// taken from https://github.com/eslint-community/eslint-plugin-promise/tree/main
function hasPromiseCallback(node) {
    if (node.type !== 'CallExpression') return;

    if (node.callee.type !== 'MemberExpression') return;
    const propertyName = node.callee.property.name;

    return propertyName === 'then' || propertyName === 'catch' || propertyName === 'finally';
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: 'This forbid synchronous setting of state in effect to prevent redundant commits',
            recommended: true,
            url: 'https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes',
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
    },

    create: (context) => {
        let isInUseEffect = false;
        let isInAsync = false;
        let asyncRoot = null;
        let currentComponent = null;
        let currentComponentStateSettersNames = [];
        let callExpressionNestingLevel = 0;
        let UseEffectFunctionsNestingLevel = 0;
        let currFunctionName;

        return {
            CallExpression(node) {
                callExpressionNestingLevel++;

                if (
                    node.callee.type === 'Identifier' &&
                    currentComponentStateSettersNames.includes(node.callee.name) &&
                    !isInAsync
                ) {

                    if (
                        isInUseEffect &&
                        callExpressionNestingLevel == 2 &&  // function is called on the level of useEffect(()=> {'around here and not deeper' }, [])
                        UseEffectFunctionsNestingLevel == 1
                        ) {
                        context.report({
                            node,
                            message: 'Avoid using synchronous state setters within effects',
                        });
                    } else { // call is inside new function
                        currentComponentStateSettersNames.push(currFunctionName);
                    }

                }

                // Checking if the invoked function is useEffect
                if (node.callee.type === 'Identifier' && node.callee.name === 'useEffect' && currentComponent) {
                    isInUseEffect = true;
                }

                // Checking if the function call is useState
                if (node.callee.type === 'Identifier' && node.callee.name === 'useState' && currentComponent) {
                    const isDestructuringDeclarator =
                        node.parent &&
                        node.parent.type === 'VariableDeclarator' &&
                        node.parent.id.type === 'ArrayPattern';

                    if (!isDestructuringDeclarator) {
                        return;
                    }

                    const isImmediateReturn = node.parent && node.parent.type === 'ReturnStatement';

                    if (isImmediateReturn) {
                        return;
                    }

                    const variableNodes = node.parent.id.elements;
                    const setterVariable = variableNodes[1];
                    currentComponentStateSettersNames.push(setterVariable.name);
                }

                if (
                    node.callee.type === 'Identifier' &&
                    (node.callee.name === 'setTimeout' || node.callee.name === 'setInterval')
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

            'CallExpression:exit': function (node) {
                callExpressionNestingLevel--;
                if (node.callee.type === 'Identifier' && node.callee.name === 'useEffect') {
                    isInUseEffect = false;
                }

                // The current implementation does not consider nested setTimeout calls.
                if (
                    node.callee.type === 'Identifier' &&
                    (node.callee.name === 'setTimeout' || node.callee.name === 'setInterval')
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

            ':function': function (node) {
                if (node.async) {
                    isInAsync = true;
                    return;
                }

                const name = getFunctionName(node);
                currFunctionName = name && name.name;

                if (isInUseEffect) {
                    UseEffectFunctionsNestingLevel++;
                }

                if (name && isComponentName(name)) {
                    // We  doesn't consider nested component declaration
                    currentComponent = node;
                }
            },

            ':function:exit': function (node) {
                if (node === currentComponent) {
                    currentComponent = null;
                    currentComponentStateSettersNames = [];
                }

                if (isInUseEffect) {
                    UseEffectFunctionsNestingLevel--;
                }

                if (node.async) {
                    isInAsync = false;
                }
            },
        };
    },
};
