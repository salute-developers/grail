# eslint-plugin-salute-react

ESLint plugin with custom rules from the Speed Team.

## Installation

```bash
npm install --save-dev eslint-plugin-salute-react
# or
yarn add -D eslint-plugin-salute-react
# or
pnpm add -D eslint-plugin-salute-react
# or
bun add -D eslint-plugin-salute-react
```

## Requirements

- ESLint v8.50.0+ or v9.0.0+
- @typescript-eslint/eslint-plugin v8.0.0+
- @typescript-eslint/parser v8.0.0+
- typescript-eslint v8.0.0+

## Usage

### Flat Config (recommended)

```js
import salute from "eslint-plugin-salute-react/flat";

export default [salute.configs.recommended];
```

### Legacy Config

```js
module.exports = {
  extends: ["plugin:salute-react/recommended"],
};
```

## Rules

This plugin includes the following rules:

### no-memoized-primitives

Prevents unnecessary memoization of primitive values.

```js
// ❌ Bad
useMemo(() => 42, []);
useMemo(() => "string", []);

// ✅ Good
const value = 42;
const str = "string";
```

### no-modifying-ref-on-render

Prevents modifying ref values during component render.

```js
// ❌ Bad
function Component() {
  const ref = useRef();
  ref.current = someValue; // Direct modification during render

  return <div />;
}

// ✅ Good
function Component() {
  const ref = useRef();
  useEffect(() => {
    ref.current = someValue;
  }, [someValue]);

  return <div />;
}
```

### no-redundant-commit

Prevents redundant commits in state updates.

```js
// ❌ Bad
const [state, setState] = useState(0);
setState(state);

// ✅ Good
const [state, setState] = useState(0);
setState(newValue);
```

### prefer-lazy-state-initialization

Enforces lazy initialization for expensive state computations.

```js
// ❌ Bad
const [state] = useState(expensiveComputation());

// ✅ Good
const [state] = useState(() => expensiveComputation());
```

## License

MIT
