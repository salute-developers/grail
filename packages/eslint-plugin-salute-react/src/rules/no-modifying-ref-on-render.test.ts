import { RuleTester } from "@typescript-eslint/rule-tester";
import { describe, it } from "vitest";
import rule from "./no-modifying-ref-on-render.js";

RuleTester.afterAll = () => {};
RuleTester.it = it;
RuleTester.describe = describe;

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

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
      errors: [{ messageId: "noModifyingRefOnRender" as const }],
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
      errors: [{ messageId: "noModifyingRefOnRender" as const }],
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
      errors: [{ messageId: "noModifyingRefOnRender" as const }],
    },
  ],
};

ruleTester.run("no-modifying-ref-on-render", rule, tests);
