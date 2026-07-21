import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Mirrors packages/mama/vitest.config.ts: jsdom + RTL, minimal setup.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // Required for @testing-library/react auto-cleanup between tests.
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
