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
    ],
};

function errorMsg() {
    return { message: 'Do not write ref.current during rendering' };
}

ruleTester.run('no-modifying-ref-on-render', rule, tests);
