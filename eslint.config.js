import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      "exampleSite/public/**",
      "node_modules/**",
      "playwright-report/**",
      "resources/**",
      "test-results/**",
    ],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      "no-console": "warn",
    },
  },
  {
    files: ["scripts/**"],
    rules: {
      "no-console": "off",
    },
  },
];
