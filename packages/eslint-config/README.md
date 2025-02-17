# @salutejs/eslint-config

ESLint configuration preset.

## Installation

```bash
npm install --save-dev @salutejs/eslint-config eslint
# or
yarn add --dev @salutejs/eslint-config eslint
# or
pnpm add -D @salutejs/eslint-config eslint
# or
bun add -D @salutejs/eslint-config eslint
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
- `eslint-plugin-cypress` - Cypress rules

## Usage

```js
// eslint.config.js
import {
  configBase,
  configNextJs,
  configReact,
  configReactCompiler,
  configCypress,
  createConfig,
  configPrettier,
  saluteRules,
} from "@salutejs/eslint-config";

/**
 * @type {import('typescript-eslint').ConfigArray}
 */
export default createConfig(
  configBase,
  configReact,
  configNextJs,
  configReactCompiler,
  configCypress,
  configPrettier, // always last
  { rules: saluteRules }, // always last
);
```

`createConfig` is an alias for `tseslint.config`, see [typescript-eslint#config](https://typescript-eslint.io/packages/typescript-eslint#config).

> Do not use `configReactCompiler` and `configReactPerf` together. `configReactCompiler` is recommended.

### Customizing `configCypress`:

```js
createConfig({
  files: ["path-to-cypress-files/*"],
  extends: [configCypress],
});
```

### Customizing `rules`:

```js
import { saluteRules } from "@salutejs/eslint-config";

createConfig(
  // configs
  {
    rules: {
      ...saluteRules,
      "no-console": "off",
    },
  },
);
```

### Legacy Config (for ESLint < v8.57.0)

See [@eslint/compat](https://www.npmjs.com/package/@eslint/compat) package and [ESLint Compatibility Utilities blog post](https://eslint.org/blog/2024/05/eslint-compatibility-utilities).

## License

MIT
