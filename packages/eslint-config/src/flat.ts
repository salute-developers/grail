import tseslint, { ConfigArray } from "typescript-eslint";
import js from "@eslint/js";
// @ts-expect-error -- does not have types
import importPlugin from "eslint-plugin-import";
import { rules } from "./rules";

export const config: ConfigArray = tseslint.config(
    js.configs.recommended,
    tseslint.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        extends: [importPlugin.flatConfigs.recommended, importPlugin.flatConfigs.typescript],
    },
    {
        rules,
    },
);

export default config;
