import { buildWithConfig } from "@illog/esbuild-config";
import { vanillaExtractPlugin } from "@vanilla-extract/esbuild-plugin";

buildWithConfig({
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  formats: ["cjs", "esm"],
  external: "auto",
  plugins: [vanillaExtractPlugin()],
});
