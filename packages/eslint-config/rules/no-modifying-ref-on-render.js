const { isComponentName, getFunctionName } = require('./helpers');
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function reportError(context, node) {
    context.report({
        node,
        message: 'Do not write ref.current during rendering',
    });
}

module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: 'Do not write ref.current during rendering',
            recommended: true,
            url: 'https://react.dev/reference/react/useRef#caveats',
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
    },

    create: (context) => {
        let isInUseEffect = false;
        let useCallbackNode;
        let functionNestingStack = [];
        let currentComponent;
        let currentComponentRefNames = [];
        let refModifyingFunctions = [];
        let nestingLevel = 0;

        return {
            CallExpression(node) {
                if (node.callee.type !== 'Identifier') {
                    return;
                }
                const name = node.callee.name;

                // Checking if the invoked function is useRef
                if (name === 'useRef') {
                    const isDeclaration =
                        node.parent &&
                        node.parent.type === 'VariableDeclarator' &&
                        node.parent.id.type === 'Identifier';

                    if (!isDeclaration) {
                        return;
                    }

                    // store all refs names
                    const refName = node.parent.id.name;
                    currentComponentRefNames.push(refName);
                }

                if (name === 'useCallback') {
                    useCallbackNode = node;
                }

                // Checking if the invoked function is useEffect
                if (name === 'useEffect') {
                    isInUseEffect = true;
                }

                if (refModifyingFunctions.includes(name) && nestingLevel === 0 && currentComponent) {
                    reportError(context, node);
                }
            },
            'CallExpression:exit': function (node) {
                if (node.callee.type === 'Identifier' && node.callee.name === 'useEffect') {
                    isInUseEffect = false;
                }

                if (node.callee.type === 'Identifier' && node.callee.name === 'useCallback') {
                    useCallbackNode = null;
                }
            },

            ':function': function (node) {
                if (currentComponent) {
                    nestingLevel++;
                    functionNestingStack.push(node);
                }
                const name = getFunctionName(node);

                if (name && isComponentName(name)) {
                    currentComponent = node;
                }
            },

            ':function:exit': function (node) {
                if (node === currentComponent) {
                    currentComponent = null;
                    currentComponentRefNames = [];
                    nestingLevel = 0;
                } else {
                    if (currentComponent) {
                        nestingLevel--;
                        functionNestingStack.pop();
                    }
                }
            },

            'AssignmentExpression > MemberExpression': function (node) {
                if (
                    currentComponentRefNames.includes(node.object.name) &&
                    node.property.name === 'current' && // this is for ref.current
                    !isInUseEffect
                ) {
                    if (nestingLevel == 0 && currentComponent) {
                        reportError(context, node);
                        //  Determining the function that alter the ref and store its name
                    } else {
                        if (useCallbackNode) {
                            const isDeclaration =
                                useCallbackNode.parent &&
                                useCallbackNode.parent.type === 'VariableDeclarator' &&
                                useCallbackNode.parent.id.type === 'Identifier';

                            if (!isDeclaration) {
                                return;
                            }

                            const callbackName = useCallbackNode.parent.id.name;
                            refModifyingFunctions.push(callbackName);
                        } else {
                            const currFunction = functionNestingStack[functionNestingStack.length - 1];
                            const name = getFunctionName(currFunction);
                            const currFunctionName = name && name.name;
                            if (currFunctionName) {
                                refModifyingFunctions.push(currFunctionName);
                            }
                        }
                    }
                }
            },
        };
    },
};
