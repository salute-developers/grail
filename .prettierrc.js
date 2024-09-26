module.exports = {
    arrowParens: 'always',
    printWidth: 120,
    bracketSameLine: false,
    jsxSingleQuote: false,
    endOfLine: 'auto',
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    useTabs: false,
    overrides: [
        {
            files: '*.{json,md,yaml,yml}',
            options: {
                tabWidth: 2,
            },
        },
    ],
    plugins: ['prettier-plugin-packagejson'],
};
