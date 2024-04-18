const { RuleTester } = require('eslint');
('use strict');

const rule = require('./prefer-lazy-state-initialization');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
});

const message = rule.meta.messages.useLazyInitialization;

ruleTester.run('prefer-lazy-state-initialization', rule, {
    valid: [
        // give me some code that won't trigger a warning
        'useState()',
        'useState("")',
        'useState(true)',
        'useState(false)',
        'useState(null)',
        'useState(undefined)',
        'useState(1)',
        'useState("test")',
        'useState(value)',
        'useState(object.value)',
        'useState(1 || 2)',
        'useState(1 || 2 || 3 < 4)',
        'useState(1 && 2)',
        'useState(1 < 2)',
        'useState(1 < 2 ? 3 : 4)',
        'useState(1 == 2 ? 3 : 4)',
        'useState(1 === 2 ? 3 : 4)',
        'useState(()=>getValue());',
        'useState(function(){ return  getValue()})',
        {
            code: `
            const MyComponent = (props) => {
                const [todos, setTodos] = useState(() => createTodos());
                return <div>{todos}</div>;
            }`,
        },
    ],

    invalid: [
        {
            code: 'useState(1 || getValue())',
            errors: [{ message, type: 'CallExpression' }],
        },
        {
            code: 'useState(2 < getValue())',
            errors: [{ message, type: 'CallExpression' }],
        },
        {
            code: 'useState(getValue())',
            errors: [{ message, type: 'CallExpression' }],
        },
        {
            code: 'useState(getValue(1, 2, 3))',
            errors: [{ message, type: 'CallExpression' }],
        },
        {
            code: 'useState(a ? b : c())',
            errors: [{ message, type: 'CallExpression' }],
        },
        {
            code: 'useState(a() ? b : c)',
            errors: [{ message, type: 'CallExpression' }],
        },
        {
            code: 'useState(a ? (b ? b1() : b2) : c)',
            errors: [{ message, type: 'CallExpression' }],
        },
        {
            code: 'useState(a() && b)',
            errors: [{ message, type: 'CallExpression' }],
        },
        {
            code: 'useState(a && b())',
            errors: [{ message, type: 'CallExpression' }],
        },
        {
            code: 'useState(a() && b())',
            errors: [
                { message, type: 'CallExpression' },
                { message, type: 'CallExpression' },
            ],
        },
    ],
});
