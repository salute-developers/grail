---
"@salutejs/eslint-config": major
"eslint-plugin-salute-react": minor
---

Update configs for ESLint 10:

- Require ESLint 9 or 10 (peer `^9.0.0 || ^10.0.0`), drop ESLint 8 support.
- Replace `eslint-plugin-import` with `eslint-plugin-import-x`. Rule names change from `import/*` to `import-x/*`. Update custom rule overrides and `settings` keys (`import/resolver` -> `import-x/resolver`) accordingly.
- Update `eslint-plugin-cypress` to v7. Import the plugin from `eslint-plugin-cypress` instead of `eslint-plugin-cypress/flat`.
- Update `eslint-plugin-react-hooks` to v7. The minimal rule set (`react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`) is preserved.
- Update `eslint-plugin-react-compiler` to `19.1.0-rc.2`.
- `eslint:recommended` from ESLint 10 enables three new rules: `no-unassigned-vars`, `no-useless-assignment`, `preserve-caught-error`. Fix or disable them in your code if needed.
- ESLint 10 tracks JSX references. `no-unused-vars` may report new findings in JSX files.
- Widen the TypeScript peer range to `>=4.8.4 <6.1.0`.

For `eslint-plugin-salute-react`: add ESLint 10 to the peer range and update dev tooling.
