const { RuleTester } = require('eslint');

const rule = require('./no-modifying-ref-on-render');

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
            code: `
            const MyComponent = (props) => {
               const ref = useRef(props);
            
                useEffect(() => {
                    ref.current = props;
                })
            
                return <div>text</div>;
            }`,
        },
        {
            code: `
            const MyComponent = (props) => {
                const ref = useRef(props);
                return <div>text</div>;
            }`,
        },
        {
            code: `
            const MyComponent = (props) => {
                const ref = useRef(props);
                useEffect(() => {
                    // Do something
                }, []);
                return <div>text</div>;
            }`,
        },
        {
            code: `
            const MyComponent = (props) => {
                const ref = useRef(props);
                useEffect(() => {
                    ref.current = props;
                }, [props]);
                return <div>text</div>;
            }`,
        },
        {
            code: `
            const MyComponent = (props) => {
                const ref = useRef(props);
                const a = useCallback((someValue) => {
                    ref.current = someValue
                },[])
                return <button onClick={a}>text</button>;
            }`,
        },
        {
            code: `
            const MyComponent = (props) => {
                const ref = useRef(props);
                const foo = (someValue) => {
                    ref.current = someValue
                }
                const bar = () => foo('theVal')
                return <button onClick={bar}>text</button>;
            }`,
        },
        {
            code: `
            const MyComponent = (props) => {
                const ref = useRef(props);
                const a = useCallback((someValue) => {
                    ref.current = someValue
                }, [])
                return <button onClick={a}>text</button>;
            }`,
        },
    ],
    invalid: [
        {
            code: `
            const MyComponent = (props) => {
                const ref = useRef(props);
                ref.current = props;
            
                return <div>text</div>;
            }`,
            errors: [errorMsg()],
        },
        {
            code: `
            const MyComponent = (props) => {
                const ref = useRef(props);
                const a = useCallback((someValue) => {
                    ref.current = someValue
                }, [])
                a()
                return <button onClick={a}>text</button>;
            }`,
            errors: [errorMsg()],
        },
        {
            code: `
            const MyComponent = (props) => {
                const ref = useRef(props);
                const foo = (someValue) => {
                    ref.current = someValue
                }
                foo();
                return <button>text</button>;
            }`,
            errors: [errorMsg()],
        },
    ],
};

function errorMsg() {
    return { message: 'Do not write ref.current during rendering' };
}

ruleTester.run('no-modifying-ref-on-render', rule, tests);
