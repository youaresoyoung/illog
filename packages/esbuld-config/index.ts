import { build } from "esbuild";

interface BuildConfig {
  entryPoints: string[];
  outdir: string;
  formats?: ("cjs" | "esm")[];
}

export async function buildWithConfig(config: BuildConfig) {
  const { entryPoints, outdir, formats = ["cjs", "esm"] } = config;

  console.log(`🚀 Building ${formats.join(" + ")}...`);
  console.log(`📂 Entry Points: ${entryPoints.join(", ")}`);
  console.log(`📂 Output Directory: ${outdir}`);

  const buildPromises = formats.map((format) => {
    const buildOptions = {
      entryPoints,
      outdir,
      bundle: true,
      format,
      sourcemap: true,
      target: "ES2022",
      outExtension: { ".js": format === "cjs" ? ".cjs" : ".js" },
    };

    return build(buildOptions);
  });

  await Promise.all(buildPromises).catch((error) => {
    console.error("❌ Build failed:", error);
  });

  console.log("✅ Build completed successfully.");
}
