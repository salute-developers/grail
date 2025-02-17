// @ts-check

import {
  configBase,
  configNextJs,
  configReact,
  configReactCompiler,
  configCypress,
  configReactPerf,
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
  configReactPerf,
  configReactCompiler,
  configCypress,
  configPrettier,
  { rules: saluteRules },
);
