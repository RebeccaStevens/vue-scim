/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

const project = ["./tsconfig.json", "./cypress/tsconfig.json"];

module.exports = {
  root: true,
  extends: [
    "@rebeccastevens/eslint-config/modern",
    "@rebeccastevens/eslint-config/typescript",
    "@rebeccastevens/eslint-config/common-overrides",
    "plugin:vue/vue3-essential",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier",
    "./.eslintrc-auto-import.json",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project,
    extraFileExtensions: [".cjs", ".mjs", ".vue"],
  },
  ignorePatterns: [
    "/dist/",
    "/src/public",
    "/src/app/auto-imports.d.ts",
    "/src/app/auto-imports-components.d.ts",
    "/src/app/raw/img/icons/**/index.ts",
    "/**/*.md",
  ],
  env: {
    "vue/setup-compiler-macros": true,
  },
  rules: {
    "@typescript-eslint/no-empty-function": "warn",
    "import/no-useless-path-segments": [
      "error",
      {
        noUselessIndex: true,
      },
    ],
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: ["index"],
      },
    ],
    // @see https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1788
    "unicorn/no-array-for-each": "off",
    // Incompatible with too many built in types
    "@typescript-eslint/prefer-readonly-parameter-types": "off",
    "import/default": "off",
    "import/no-relative-parent-imports": "off",
    "import/no-unassigned-import": "off",
  },
  overrides: [
    {
      files: ["cypress/integration/**.spec.ts"],
      extends: ["plugin:cypress/recommended"],
    },
    {
      files: ["typings/**"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
    {
      files: ["src/**"],
      rules: {
        "node/prefer-global/console": "off",
        "unicorn/prefer-node-protocol": "off",
      },
    },
    {
      files: ["src/app/main.ts", "src/app/modules/**/*"],
      rules: {
        "import/no-extraneous-dependencies": "off",
      },
    },
    {
      files: ["src/app/layouts/**/*.vue", "src/app/pages/**/*.vue"],
      rules: {
        "vue/multi-word-component-names": "off",
      },
    },
    {
      files: ["src/app/raw/**/*.ts"],
      rules: {
        "import/no-duplicates": "off",
      },
    },
    {
      files: ["**/*.vue", "**/*.test.ts"],
      rules: {
        "unicorn/filename-case": "off",
      },
    },
    {
      files: ["./*", "./**/*.md/**", "./cypress/**/*"],
      parserOptions: {
        project: null,
      },
      rules: {
        "@typescript-eslint/await-thenable": "off",
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/dot-notation": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/no-confusing-void-expression": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-for-in-array": "off",
        "@typescript-eslint/no-implied-eval": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-throw-literal": "off",
        "@typescript-eslint/no-unnecessary-condition": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/non-nullable-type-assertion-style": "off",
        "@typescript-eslint/prefer-includes": "off",
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/prefer-readonly-parameter-types": "off",
        "@typescript-eslint/prefer-readonly": "off",
        "@typescript-eslint/prefer-regexp-exec": "off",
        "@typescript-eslint/prefer-string-starts-ends-with": "off",
        "@typescript-eslint/promise-function-async": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/switch-exhaustiveness-check": "off",
        "@typescript-eslint/unbound-method": "off",
        "functional/functional-parameters": "off",
        "functional/immutable-data": "off",
        "functional/no-class": "off",
        "functional/no-expression-statement": "off",
        "functional/no-let": "off",
        "functional/no-loop-statement": "off",
        "functional/no-return-void": "off",
        "functional/no-this-expression": "off",
        "functional/no-throw-statement": "off",
        "functional/no-try-statement": "off",
        "functional/prefer-readonly-type": "off",
        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "off",
        "init-declarations": "off",
        "jsdoc/require-jsdoc": "off",
        "no-console": "off",
        "no-empty": "off",
        "no-invalid-this": "off",
        "no-undef": "off",
        "no-useless-return": "off",
        "node/handle-callback-err": "off",
        "node/no-unpublished-require": "off",
        "prefer-const": "off",
        "prettier/prettier": "off",
        "sonarjs/no-extra-arguments": "off",
        "sonarjs/no-unused-collection": "off",
        "unicorn/no-empty-file": "off",
        "unicorn/prefer-module": "off",
        "unicorn/prefer-optional-catch-binding": "off",
        "unicorn/prefer-top-level-await": "off",

        "dot-notation": "error",
        "no-implied-eval": "error",
        "require-await": "error",
      },
    },
  ],
  settings: {
    "import/parsers": {
      "vue-eslint-parser": [".vue"],
      "@typescript-eslint/parser": [".ts"],
    },
    "import/resolver": {
      node: {
        extensions: [".ts"],
      },
      typescript: {
        project,
      },
    },
  },
};
