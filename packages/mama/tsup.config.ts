import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  // Styles and icons stay as files: the consumer app's bundler processes them.
  // Runtime libraries used by the sources are not inlined: they stay external
  // until they are declared in mama's package.json (cleanup in later pieces).
  external: [
    /\.module\.scss$/,
    /\.svg$/,
    /^reactjs-popup/,
    "react-toastify",
    "react-paginate",
    "@hookform/devtools",
  ],
});
