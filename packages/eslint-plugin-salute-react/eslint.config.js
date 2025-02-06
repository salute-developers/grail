// @ts-check

import config from "@repo/eslint-config/base";
import eslintPlugin from "eslint-plugin-eslint-plugin";

export default [...config, eslintPlugin.configs["flat/recommended"]];
