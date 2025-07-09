import { buildWithConfig } from "@illog/esbuild-config";

buildWithConfig({
  entryPoints: ["src/index.ts"],
  outdir: "dist",
  formats: ["cjs", "esm"],
});
