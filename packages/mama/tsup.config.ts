import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  // Styles and icons stay as files: the consumer app's bundler processes them.
  // Runtime libraries are external via the manifest: tsup treats dependencies
  // and peerDependencies declared in package.json as external by default.
  external: [/\.module\.scss$/, /\.svg$/],
});
