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
        let currentComponent;
        let currentComponentRefNames = [];

        return {
            CallExpression(node) {
                // Checking if the invoked function is useRef
                if (node.callee.type === 'Identifier' && node.callee.name === 'useRef') {
                    const isDeclaration =
                        node.parent &&
                        node.parent.type === 'VariableDeclarator' &&
                        node.parent.id.type === 'Identifier';

                    if (!isDeclaration) {
                        return;
                    }

                    const refName = node.parent.id.name;
                    currentComponentRefNames.push(refName);
                }

                // Checking if the invoked function is useEffect
                if (node.callee.type === 'Identifier' && node.callee.name === 'useEffect') {
                    isInUseEffect = true;
                }
            },
            'CallExpression:exit': function (node) {
                if (node.callee.type === 'Identifier' && node.callee.name === 'useEffect') {
                    isInUseEffect = false;
                }
            },

            ':function': function (node) {
                const name = getFunctionName(node);
                currFunctionName = name && name.name;

                if (name && isComponentName(name)) {
                    currentComponent = node;
                }
            },

            ':function:exit': function (node) {
                if (node === currentComponent) {
                    currentComponent = null;
                    currentComponentRefNames = [];
                }
            },

            'AssignmentExpression > MemberExpression': function (node) {
                if (
                    currentComponentRefNames.includes(node.object.name) &&
                    node.property.name === 'current' &&
                    !isInUseEffect
                ) {
                    reportError(context, node);
                }
            },
        };
    },
};
