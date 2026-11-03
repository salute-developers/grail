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

- Node.js 20.19+ or 22.13+ (for ESLint 10)
- ESLint 9.x or 10.x
- TypeScript 4.8.4 - 6.0.x

## Included Plugins

- `@eslint/js` - Core ESLint rules
- `@typescript-eslint` - TypeScript support and rules
- `@next/eslint-plugin-next` - Next.js specific rules
- `eslint-plugin-react` - React core rules
- `eslint-plugin-react-hooks` - React Hooks rules
- `eslint-plugin-react-perf` - React performance rules
- `eslint-plugin-react-compiler` - React compiler optimizations
- `eslint-plugin-jsx-a11y` - Accessibility rules
- `eslint-plugin-import-x` - ES6+ import/export rules
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
  {
    // always last
    rules: {
      ...saluteRules, // for backend and frontend code
      ...reactRules, // only for frontend
    },
  },
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
      ...saluteRules, // for backend and frontend code
      ...reactRules, // only for frontend
      "no-console": "off",
    },
  },
);
```

## License

MIT
