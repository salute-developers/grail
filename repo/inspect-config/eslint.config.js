// @ts-check

import {
  configBase,
  configNextJs,
  configReact,
  configReactWithCompiler,
} from "@salutejs/eslint-config/flat";

export default [
  ...configBase,
  ...configReact,
  ...configNextJs,
  ...configReactWithCompiler,
];
