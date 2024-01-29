// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function reportError (context, node) {
    context.report({
        node,
        message: 'Do not memoize primitives',
    });
}

module.exports = {
    meta: {
        type: null, // `problem`, `suggestion`, or `layout`
        docs: {
            description: 'Do not memoize primitives',
            recommended: true,
            url: 'https://dev.to/katekate/another-react-dos-and-donts-4ba0#12-dont-use-raw-usememo-endraw-for-primitive-memoization',
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [], // Add a schema if the rule has options
    },

    create: (context) => {
        let currentUseMemoNode = null;
        let nestingLevel = 0;

        return {
            CallExpression(node) {
                // Checking if the invoked function is useMemo
                if (node.callee.type === 'Identifier' && node.callee.name === 'useMemo') {
                    currentUseMemoNode = node;
                }
            },

            'CallExpression:exit': function (node) {
                if (node === currentUseMemoNode) {
                    currentUseMemoNode = null;
                }
            },

            ':function': function (node) {
                nestingLevel++;
            },

            ':function:exit': function (node) {
                nestingLevel--;
            },

            // Plain TemplateLiteral,
            // Here we have [expressions.length = 0] to sort out this kind of stings `lorem ipsum ${dolor()}`
            ':matches(ArrowFunctionExpression, ReturnStatement) > TemplateLiteral[expressions.length = 0] ': function (
                node,
            ) {
                if (currentUseMemoNode && nestingLevel === 1) {
                    reportError(context,node)
                }
            },

            // for this kind `lorem ipsum ${'dolor'}` or `lorem ipsum ${variable}`
            ':matches(ArrowFunctionExpression, ReturnStatement) > TemplateLiteral > :matches(Literal, Identifier)':
                function (node) {
                    if (currentUseMemoNode && nestingLevel === 1) {
                        reportError(context,node)
                    }
                },

            ':matches(ArrowFunctionExpression, ReturnStatement) > Literal': function (node) {
                // return "undefined" is allowed
                if (node.name && node.name === 'undefined') {
                    return;
                }

                // return "null" is allowed
                if (node.raw && node.raw === 'null') {
                    return;
                }
                if (currentUseMemoNode && nestingLevel === 1) {
                    reportError(context,node)
                }
            },
        };
    },
};
