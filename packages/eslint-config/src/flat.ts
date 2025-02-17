import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import tseslint, { ConfigArray } from "typescript-eslint";
import salutePlugin from "eslint-plugin-salute-react";
// @ts-expect-error -- does not have types
import pluginNext from "@next/eslint-plugin-next";
// @ts-expect-error -- does not have types
import reactPerfPlugin from "eslint-plugin-react-perf";
// @ts-expect-error -- does not have types
import reactCompiler from "eslint-plugin-react-compiler";
// @ts-expect-error -- does not have types
import pluginReactHooks from "eslint-plugin-react-hooks";
// @ts-expect-error -- does not have types
import jsxA11y from "eslint-plugin-jsx-a11y";
// @ts-expect-error -- does not have types
import eslintConfigPrettier from "eslint-config-prettier";
// @ts-expect-error -- does not have types
import importPlugin from "eslint-plugin-import";
import { rules } from "./rules.js";

export const configBase: ConfigArray = tseslint.config(
  js.configs.recommended,
  tseslint.configs.recommended,
  salutePlugin.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],
  },
  {
    rules,
  },
  eslintConfigPrettier,
);

export const configReact: ConfigArray = tseslint.config(
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...reactPlugin.configs.flat.recommended,
    languageOptions: {
      ...reactPlugin.configs.flat.recommended?.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  reactPlugin.configs.flat["jsx-runtime"] ?? {},
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
    },
  },
  reactPerfPlugin.configs.flat.recommended,
);

export const configNextJs: ConfigArray = tseslint.config({
  plugins: {
    "@next/next": pluginNext,
  },
  rules: {
    ...pluginNext.configs.recommended.rules,
    ...pluginNext.configs["core-web-vitals"].rules,
  },
});

export const configReactWithCompiler: ConfigArray = tseslint.config(
  reactCompiler.configs.recommended,
);
