import { RuleTester } from "@typescript-eslint/rule-tester";
import { describe, it } from "vitest";
import rule from "./prefer-lazy-state-initialization.js";

RuleTester.afterAll = () => {};
RuleTester.it = it;
RuleTester.describe = describe;

const ruleTester = new RuleTester({
  languageOptions: {
    sourceType: "module",
    ecmaVersion: 2018,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("prefer-lazy-state-initialization", rule, {
  valid: [
    "useState()",
    'useState("")',
    "useState(true)",
    "useState(false)",
    "useState(null)",
    "useState(undefined)",
    "useState(1)",
    'useState("test")',
    "useState(value)",
    "useState(object.value)",
    "useState(1 || 2)",
    "useState(1 || 2 || 3 < 4)",
    "useState(1 && 2)",
    "useState(1 < 2)",
    "useState(1 < 2 ? 3 : 4)",
    "useState(1 == 2 ? 3 : 4)",
    "useState(1 === 2 ? 3 : 4)",
    "useState(()=>getValue());",
    "useState(function(){ return  getValue()})",
    `const MyComponent = (props) => {
                const [todos, setTodos] = useState(() => createTodos());
                return <div>{todos}</div>;
            }`,
  ],

  invalid: [
    {
      code: "useState(1 || getValue())",
      errors: [{ messageId: "useLazyInitialization" }],
    },
    {
      code: "useState(2 < getValue())",
      errors: [{ messageId: "useLazyInitialization" }],
    },
    {
      code: "useState(getValue())",
      errors: [{ messageId: "useLazyInitialization" }],
    },
    {
      code: "useState(getValue(1, 2, 3))",
      errors: [{ messageId: "useLazyInitialization" }],
    },
    {
      code: "useState(a ? b : c())",
      errors: [{ messageId: "useLazyInitialization" }],
    },
    {
      code: "useState(a() ? b : c)",
      errors: [{ messageId: "useLazyInitialization" }],
    },
    {
      code: "useState(a ? (b ? b1() : b2) : c)",
      errors: [{ messageId: "useLazyInitialization" }],
    },
    {
      code: "useState(a() && b)",
      errors: [{ messageId: "useLazyInitialization" }],
    },
    {
      code: "useState(a && b())",
      errors: [{ messageId: "useLazyInitialization" }],
    },
    {
      code: "useState(a() && b())",
      errors: [
        { messageId: "useLazyInitialization" },
        { messageId: "useLazyInitialization" },
      ],
    },
  ],
});
