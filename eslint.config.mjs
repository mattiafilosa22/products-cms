import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

// Shared monorepo config: TypeScript sources only (apps/web, packages/mama,
// backend/src). apps/web keeps its own Next-specific config for `next lint`.
export default tseslint.config(
  {
    ignores: [
      "**/node_modules/",
      "**/.next/",
      "**/dist/",
      "**/coverage/",
      "**/*.js",
      "**/*.mjs",
      "**/*.cjs",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      // Pre-existing Express `catch (error)` handlers ignore the error object;
      // the backend is replaced by Route Handlers in Piece 5.
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
    },
  },
);
