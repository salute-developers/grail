const { RuleTester } = require('eslint');

const rule = require('./no-memoized-primitives');

const ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
});

// Use only: true, too run one test only

const tests = {
    valid: [
        {
            code: `const a = '1';`,
        },
        {
            code: 'const b = `asd${a}`',
        },
        {
            code: 'const c = `${asd()}asdf`',
        },
        {
            code: 'useMemo(function(){ return `${asd()}asdf`}, [foo])',
        },
        {
            code: 'useMemo(() => `${asd()}asdf`, [foo])',
        },
        {
            code: 'useMemo(()=> { return {asdf: 3}}, [foo])',
        },
        {
            code: 'useMemo(()=> { return {asdf: a}}, [foo])',
        },
        {
            code: 'useMemo(function() { return `asd ${foo()}`}, [foo])',
        },
        {
            code: `
            useMemo(function() {
                const callback = () => null
                
                return callback
            }, [foo])
            `,
        },
        {
            code: `
            useMemo(function() {
                const callback = function() {
                    return null
                } 
                return callback
            }, [foo])
            `,
        },
        {
            code: `
            useMemo(function() {
                return undefined
            }, [foo])
            `,
        },
        {
            code: `
            useMemo(function() {
                return null
            }, [foo])
            `,
        },
    ],
    invalid: [
        {
            code: 'useMemo(function() { return `asd`}, [foo])',
            errors: [errorMsg()],
        },
        {
            code: 'useMemo(() =>  `asd`, [foo])',
            errors: [errorMsg()],
        },
        {
            code: 'useMemo(function() { return `asd ${2}`}, [foo]) ',
            errors: [errorMsg()],
        },
        {
            code: 'useMemo(() => `asd ${2}`, [foo]) ',
            errors: [errorMsg()],
        },
        {
            code: 'useMemo(() => { return `asd${2}`}, [foo]) ',
            errors: [errorMsg()],
        },
        {
            code: 'useMemo(()=> `asd${a} asdf ${b}`, [foo])',
            errors: [errorMsg(), errorMsg()],
        },
        {
            code: `useMemo(() => { return 'asd'}, [foo])`,
            errors: [errorMsg()],
        },
        {
            code: 'useMemo(function(){ return `asd`}, [foo])',
            errors: [errorMsg()],
        },
        {
            code: 'useMemo(function() { return `asd ${a}`}, [foo])',
            errors: [errorMsg()],
        },
        {
            code: `useMemo(() =>  'asd', [foo])`,
            errors: [errorMsg()],
        },
        {
            code: 'useMemo(() =>  `asd`, [foo])',
            errors: [errorMsg()],
        },
        {
            code: 'useMemo(function() { return `asd`}, [foo])',
            errors: [errorMsg()],
        },
        {
            code: `
            useMemo(function() { 
                if (flag) {
                      return 'foo'      
                }
                return 'bar'
            }, [foo])
            `,
            errors: [errorMsg(), errorMsg()],
        },
    ],
};

function errorMsg() {
    return { message: 'Do not memoize primitives' }
}

ruleTester.run('no-memoized-primitives', rule, tests);
