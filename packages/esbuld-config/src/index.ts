import { build } from "esbuild";

export async function buildBasic() {
  console.log("🚀 Building CJS and ESM modules...");

  await build({
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    bundle: true,
    format: "cjs",
    sourcemap: true,
    target: "es2022",
    outExtension: { ".js": ".cjs" },
  });

  await build({
    entryPoints: ["src/index.ts"],
    outdir: "dist",
    bundle: true,
    format: "esm",
    target: "es2022",
    sourcemap: true,
  });

  console.log("✅ Build completed successfully.");
}
