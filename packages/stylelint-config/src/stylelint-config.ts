export default {
  extends: ["stylelint-config-recommended"],
  plugins: [
    "stylelint-scss",
    "stylelint-order",
    "stylelint-high-performance-animation",
  ],
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      customSyntax: "postcss-styled-syntax",
    },
  ],
  rules: {
    "max-nesting-depth": 4,
    "scss/at-extend-no-missing-placeholder": true,
    "scss/dollar-variable-colon-space-after": "always",
    "scss/dollar-variable-colon-space-before": "never",
    "scss/dollar-variable-no-missing-interpolation": true,
    "scss/dollar-variable-pattern": "^_?[a-z]+[\\w-]*$",
    "scss/operator-no-newline-before": true,
    "scss/operator-no-newline-after": true,
    "scss/selector-no-redundant-nesting-selector": null,

    "color-hex-length": "short",
    "color-named": "never",
    "color-no-hex": null,
    "color-no-invalid-hex": true,

    "font-family-name-quotes": "always-where-recommended",
    "font-family-no-duplicate-names": true,
    "font-family-no-missing-generic-family-keyword": [
      true,
      { ignoreFontFamilies: "a" },
    ],
    "font-weight-notation": "named-where-possible",

    "function-blacklist": [],
    "function-calc-no-unspaced-operator": true,
    "function-linear-gradient-no-nonstandard-direction": true,
    "function-name-case": "lower",
    "function-url-quotes": "always",
    "function-url-scheme-whitelist": ["https"],
    // правила whitelist и blacklist взаимоисключающие
    // "function-url-scheme-blacklist": ["data"],
    "function-whitelist": null,

    "number-max-precision": 3,

    "string-no-newline": true,

    "time-min-milliseconds": 100,

    "unit-blacklist": [],
    "unit-no-unknown": true,

    "value-keyword-case": null,
    "value-no-vendor-prefix": null,

    "shorthand-property-no-redundant-values": true,

    "property-blacklist": [],
    "property-no-unknown": true,
    "property-no-vendor-prefix": null,

    "keyframe-declaration-no-important": true,

    // "declaration-no-important": true,
    "declaration-property-unit-blacklist": {},
    "declaration-property-value-blacklist": {},
    "declaration-block-no-duplicate-properties": [
      true,
      { ignore: ["consecutive-duplicates"] },
    ],
    "declaration-block-no-redundant-longhand-properties": [
      true,
      { ignoreShorthands: ["/flex-/"] },
    ],
    "declaration-block-no-shorthand-property-overrides": true,
    "declaration-block-single-line-max-declarations": 1,

    "block-no-empty": true,

    "selector-max-universal": 0,
    "selector-max-id": 0,
    "selector-nested-pattern": "^&(?:.+)|:root$",
    "selector-pseudo-class-no-unknown": true,
    "selector-pseudo-element-colon-notation": "double",
    "selector-pseudo-element-no-unknown": true,
    "selector-type-case": ["lower", { ignoreTypes: ["/^\\$\\w./"] }],
    "selector-type-no-unknown": [true, { ignoreTypes: ["/^[$]/"] }],

    "rule-empty-line-before": [
      "always",
      {
        except: ["first-nested"],
        ignore: ["after-comment", "first-nested"],
      },
    ],

    "at-rule-empty-line-before": [
      "always",
      {
        except: ["first-nested", "blockless-after-same-name-blockless"],
        ignore: ["after-comment"],
      },
    ],
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "for",
          "mixin",
          "define-mixin",
          "media",
          "mixin-content",
          "each",
        ],
      },
    ],

    "comment-no-empty": true,
    "comment-whitespace-inside": "always",

    "no-descending-specificity": true,
    "no-duplicate-selectors": true,
    "no-empty-source": null,
    "no-invalid-double-slash-comments": true,
    "no-unknown-animations": true,

    "order/order": [
      "dollar-variables",
      "custom-properties",
      "declarations",
      { type: "at-rule" },
      { type: "at-rule", hasBlock: true },
      "rules",
    ],
    "order/properties-order": null,
  },
};
