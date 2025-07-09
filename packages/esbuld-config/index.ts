import { build } from "esbuild";
import { readFileSync } from "fs";
import { resolve } from "path";

interface BuildConfig {
  entryPoints: string[];
  outdir: string;
  formats?: ("cjs" | "esm")[];
  external?: string[] | "auto";
}

function getExternalDependencies(cwd: string = process.cwd()): string[] {
  try {
    const packageJsonPath = resolve(cwd, "package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

    const deps = Object.keys(packageJson.dependencies || {});
    const peerDeps = Object.keys(packageJson.peerDependencies || {});

    return [...deps, ...peerDeps];
  } catch (error) {
    console.error("⚠️ Could not read package.json:", error);
    return [];
  }
}

export async function buildWithConfig(config: BuildConfig) {
  const { entryPoints, outdir, formats = ["cjs", "esm"], external } = config;

  let externalDeps: string[] = [];
  if (external === "auto") {
    externalDeps = getExternalDependencies();
    console.log(
      `🔍 Automatically detected external dependencies: ${externalDeps.join(
        ", "
      )}`
    );
  } else if (Array.isArray(external)) {
    externalDeps = external;
  }

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
      external: externalDeps,
      target: "ESNext",
      outExtension: { ".js": format === "cjs" ? ".cjs" : ".js" },
    };

    return build(buildOptions);
  });

  await Promise.all(buildPromises).catch((error) => {
    console.error("❌ Build failed:", error);
  });

  console.log("✅ Build completed successfully.");
}
