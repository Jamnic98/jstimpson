// eslint.config.mjs
import { defineConfig } from "eslint/config";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Browser
        window: "readonly",
        document: "readonly",
        console: "readonly",
        fetch: "readonly",
        URL: "readonly",

        // Node
        process: "readonly",

        // Jest
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        jest: "readonly",

        // React/TSX
        React: "readonly",
        SVGSVGElement: "readonly",
      },
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      prettier: prettierPlugin,
    },

    rules: {
      // TypeScript
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // React
      "react/react-in-jsx-scope": "off",

      // React hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Prettier
      "prettier/prettier": "error",
    },
  },
]);
