/** @type {import("eslint").Linter.Config} */
const config = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: ["@typescript-eslint", "prettier", "import"],
  extends: [
    "next/core-web-vitals",
    // "plugin:@typescript-eslint/recommended-type-checked",
    // "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier",
  ],
  rules: {
    // "@typescript-eslint/array-type": "off",
    // "@typescript-eslint/consistent-type-definitions": "off",
    "prettier/prettier": ["warn"],
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],

    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "import/order": [
      "warn",
      {
        groups: ["external", "internal"],
        "newlines-between": "always-and-inside-groups",
        alphabetize: {
          order: "asc",
        },
      },
    ],
  },
}

module.exports = config