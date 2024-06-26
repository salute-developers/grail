// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: 'Detects function calls in useState and suggests using lazy initialization instead.',
            recommended: true,
            url: 'https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state',
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
        messages: {
            useLazyInitialization: 'Avoid calling function inside useState. Prefer lazy initialization.',
        },
    },

    create: (context) => {
        let useStateCallExpression = null;
        let nestingLevel = 0;

        return {
            CallExpression(node) {
                if (node.callee.type === 'Identifier' && node.callee.name === 'useState') {
                    useStateCallExpression = node;
                    return;
                }

                if (useStateCallExpression && nestingLevel === 0) {
                    context.report({ node, messageId: 'useLazyInitialization' });
                }
            },

            ':function': function (node) {
                if (useStateCallExpression) {
                    nestingLevel++;
                }
            },

            ':function:exit': function (node) {
                if (useStateCallExpression) {
                    nestingLevel--;
                }
            },

            'CallExpression:exit': function (node) {
                if (node === useStateCallExpression) {
                    useStateCallExpression = null;
                }
            },
        };
    },
};
