import { RuleTester } from "@typescript-eslint/rule-tester";
import { describe, it } from "vitest";
import rule from "./no-memoized-primitives.js";

RuleTester.afterAll = () => {};
RuleTester.it = it;
RuleTester.describe = describe;

const ruleTester = new RuleTester({
  languageOptions: {
    sourceType: "module",
    ecmaVersion: 2018,
  },
});

ruleTester.run("no-memoized-primitives", rule, {
  valid: [
    `const a = '1';`,
    "const b = `asd${a}`",
    "const c = `${asd()}asdf`",
    "useMemo(function(){ return `${asd()}asdf`}, [foo])",
    "useMemo(() => `${asd()}asdf`, [foo])",
    "useMemo(()=> { return {asdf: 3}}, [foo])",
    "useMemo(()=> { return {asdf: a}}, [foo])",
    "useMemo(function() { return `asd ${foo()}`}, [foo])",
    `useMemo(function() {
                const callback = () => null
                return callback
            }, [foo])
            `,
    `useMemo(function() {
                const callback = function() {
                    return null
                } 
                return callback
            }, [foo])
            `,
    `useMemo(function() {
                return undefined
            }, [foo])
            `,
    `useMemo(function() {
                return null
            }, [foo])
            `,
  ],
  invalid: [
    {
      code: "useMemo(function() { return `asd`}, [foo])",
      errors: [{ messageId: "noMemoizedPrimitives" }],
    },
    {
      code: "useMemo(() =>  `asd`, [foo])",
      errors: [{ messageId: "noMemoizedPrimitives" }],
    },
    {
      code: "useMemo(function() { return `asd ${2}`}, [foo]) ",
      errors: [{ messageId: "noMemoizedPrimitives" }],
    },
    {
      code: "useMemo(() => `asd ${2}`, [foo]) ",
      errors: [{ messageId: "noMemoizedPrimitives" }],
    },
    {
      code: "useMemo(() => { return `asd${2}`}, [foo]) ",
      errors: [{ messageId: "noMemoizedPrimitives" }],
    },
    {
      code: "useMemo(()=> `asd${a} asdf ${b}`, [foo])",
      errors: [
        { messageId: "noMemoizedPrimitives" },
        { messageId: "noMemoizedPrimitives" },
      ],
    },
    {
      code: `useMemo(() =>  'asd', [foo])`,
      errors: [{ messageId: "noMemoizedPrimitives" }],
    },
    {
      code: "useMemo(function(){ return `asd`}, [foo])",
      errors: [{ messageId: "noMemoizedPrimitives" }],
    },
    {
      code: "useMemo(function() { return `asd ${a}`}, [foo])",
      errors: [{ messageId: "noMemoizedPrimitives" }],
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
      errors: [
        { messageId: "noMemoizedPrimitives" },
        { messageId: "noMemoizedPrimitives" },
      ],
    },
    {
      code: `useMemo(() => { return 'asd'}, [foo])`,
      errors: [{ messageId: "noMemoizedPrimitives" }],
    },
    {
      code: "useMemo(() => 1 + 1, [foo])",
      errors: [{ messageId: "noMemoizedPrimitives" }],
    },
    {
      code: "useMemo(() => (flag ? 'foo' : 'bar'), [foo])",
      errors: [
        { messageId: "noMemoizedPrimitives" },
        { messageId: "noMemoizedPrimitives" },
      ],
    },
  ],
});
