import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

export default [
  {
    files: ["src/**/*.ts"],
    ignores: ["node_modules", "dist"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      import: importPlugin,
      "@typescript-eslint": tseslint,
    },
    rules: {
      // 🔤 スタイル系
      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["error", "always"],
      indent: ["error", 2],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "space-before-blocks": ["error", "always"],
      "keyword-spacing": ["error", { before: true, after: true }],
      "space-infix-ops": "error",
      "block-spacing": ["error", "always"],
      "brace-style": ["error", "1tbs", { allowSingleLine: true }],
      "eol-last": ["error", "always"],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "max-len": ["warn", { code: 100 }],
      "newline-per-chained-call": ["error", { ignoreChainWithDepth: 2 }],
      "prefer-template": "error",
      "template-curly-spacing": ["error", "never"],
      "no-trailing-spaces": "error",

      // 🧠 可読性・構造
      "no-mixed-operators": "error",
      "no-unneeded-ternary": "error",
      "no-nested-ternary": "error",
      "prefer-arrow-callback": "error",
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-confusing-arrow": "error",
      "no-var": "error",
      "prefer-const": ["error", { destructuring: "all" }],
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "no-useless-return": "error",
      "no-empty-function": ["error", { allow: ["arrowFunctions"] }],

      // 🛡️ 安全性・品質
      eqeqeq: ["error", "always"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-alert": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-unsafe-finally": "error",
      "no-unreachable": "error",
      "no-duplicate-case": "error",
      "no-extra-boolean-cast": "error",
      "no-extra-semi": "error",
      "no-irregular-whitespace": "error",
      "no-unsafe-negation": "error",

      // 📦 モジュール・import関連
      "import/order": ["error", {
        groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
        alphabetize: { order: "asc", caseInsensitive: true },
        "newlines-between": "always"
      }],
      "import/no-duplicates": "error",
      "import/newline-after-import": "error",

      // 🧪 TypeScript関連（@typescript-eslint）
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    },
  },
  eslintConfigPrettier,
];
