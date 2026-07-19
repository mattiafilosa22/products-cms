import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // SVGs are React components in the app (svgr); stub them in tests.
      {
        find: /^.+\.svg$/,
        replacement: fileURLToPath(
          new URL("./test/svg-stub.tsx", import.meta.url),
        ),
      },
      // Dev tooling rendered by Form (known debt, Piece 3): irrelevant in tests.
      {
        find: "@hookform/devtools",
        replacement: fileURLToPath(
          new URL("./test/devtools-stub.tsx", import.meta.url),
        ),
      },
    ],
  },
  test: {
    environment: "jsdom",
    // Required for @testing-library/react auto-cleanup between tests.
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    // CSS processing stays disabled (vitest default): .module.scss imports are
    // stubbed, so `sass` is not needed for tests.
  },
});
