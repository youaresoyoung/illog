import esbuild from "esbuild";

esbuild.build({
  entryPoints: ["./src/index.js"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outdir: "dist",
  format: "esm",
});

esbuild.build({
  entryPoints: ["./src/index.js"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outdir: "dist",
  format: "cjs",
  outExtension: {
    ".js": ".cjs",
  },
});
