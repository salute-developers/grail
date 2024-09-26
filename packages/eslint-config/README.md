# ESlint config from Salute Frontend Team

## Install

```bash
npm i -D @salutejs/eslint-config eslint@8
```

If `legacy-peer-deps` is enabled:

```bash
npm i -D @salutejs/prettier-config @typescript-eslint/eslint-plugin@8 @typescript-eslint/parser@8 eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-perf prettier
```

## Usage

### ESLint

```json
{
    "extends": ["all-other-configs", "@salutejs/eslint-config"]
}
```
