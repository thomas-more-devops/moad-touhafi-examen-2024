import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node, // Include Node.js globals like `console`
        ...globals.jest, // Include Jest globals like `beforeEach`
      },
    },
    rules: {
      // Customize rules here if needed
    },
  },
];
