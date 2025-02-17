# @salutejs/prettier-config

Shared Prettier configuration.

## Installation

```bash
npm install --save-dev @salutejs/prettier-config prettier@^3.4.0
# or
yarn add --dev @salutejs/prettier-config prettier@^3.4.0
# or
pnpm add --save-dev @salutejs/prettier-config prettier@^3.4.0
# or
bun add --dev @salutejs/prettier-config prettier@^3.4.0
```

## Usage

Add to your `package.json`:

```json
{
  "prettier": "@salutejs/prettier-config"
}
```

Or create `.prettierrc.js`:

```js
export default "@salutejs/prettier-config";
```

For CommonJS:

```js
module.exports = require("@salutejs/prettier-config");
```

## Configuration

The configuration includes the following settings:

```js
{
  arrowParens: "always",      // Always include parentheses around arrow function parameters
  printWidth: 120,            // Line length where Prettier will try to wrap
  bracketSameLine: false,     // Put the > of a multi-line JSX element at the end of the last line
  jsxSingleQuote: false,      // Use double quotes in JSX
  endOfLine: "auto",          // Maintain existing line endings
  semi: true,                 // Add semicolons at the end of statements
  singleQuote: true,          // Use single quotes instead of double quotes
  tabWidth: 4,               // Specify the number of spaces per indentation level
  trailingComma: "all",      // Add trailing commas wherever possible
}
```

## License

MIT
