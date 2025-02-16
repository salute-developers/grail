// @ts-check

import {
  configBase,
  configNextJs,
  configReact,
  configReactWithCompiler,
} from "@salutejs/eslint-config";

export default [
  ...configBase,
  ...configReact,
  ...configNextJs,
  ...configReactWithCompiler,
];
