# @salutejs/eslint-config

ESLint configuration preset.

## Installation

```bash
npm install --save-dev @salutejs/eslint-config
# or
yarn add --dev @salutejs/eslint-config
# or
pnpm add -D @salutejs/eslint-config
# or
bun add -D @salutejs/eslint-config
```

## Requirements

- Node.js 18.x or higher
- ESLint 8.57.0 or higher, or 9.x
- TypeScript 4.8.4 - 5.7.x

## Included Plugins

- `@eslint/js` - Core ESLint rules
- `@typescript-eslint` - TypeScript support and rules
- `@next/eslint-plugin-next` - Next.js specific rules
- `eslint-plugin-react` - React core rules
- `eslint-plugin-react-hooks` - React Hooks rules
- `eslint-plugin-react-perf` - React performance rules
- `eslint-plugin-react-compiler` - React compiler optimizations
- `eslint-plugin-jsx-a11y` - Accessibility rules
- `eslint-plugin-import` - ES6+ import/export rules
- `eslint-plugin-salute-react` - Custom Salute React rules
- `eslint-config-prettier` - Turns off ESLint rules that conflict with Prettier

## Usage

### Flat Config (recommended for ESLint 9.x)

```js
// eslint.config.js
import {
  configBase,
  configReact,
  configNextJs,
  configReactWithCompiler,
} from "@salutejs/eslint-config/flat";

export default [
  ...configBase,
  ...configReact,
  ...configNextJs,
  ...configReactWithCompiler,
];
```

### Legacy Config

```js
// .eslintrc.js
module.exports = {
  extends: ["@salutejs/eslint-config"],
};
```

## License

MIT
