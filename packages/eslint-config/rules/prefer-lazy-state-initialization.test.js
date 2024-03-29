/**
 * @fileoverview Detects function calls in useState and suggests using lazy initialization instead.
 * @author Patrick Gillespie
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('./prefer-lazy-state-initialization'),
    RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const message = rule.meta.messages.useLazyInitialization;

const ruleTester = new RuleTester();
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
