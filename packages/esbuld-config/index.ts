import { build, context } from 'esbuild'
import { readFileSync } from 'fs'
import { resolve } from 'path'

interface BuildConfig {
  entryPoints: string[]
  outdir: string
  formats?: ('cjs' | 'esm')[]
  external?: string[] | 'auto'
  plugins?: any[]
}

function getExternalDependencies(cwd: string = process.cwd()): string[] {
  try {
    const packageJsonPath = resolve(cwd, 'package.json')
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

    const deps = Object.keys(packageJson.dependencies || {})
    const peerDeps = Object.keys(packageJson.peerDependencies || {})

    return [...deps, ...peerDeps]
  } catch (error) {
    console.error('⚠️ Could not read package.json:', error)
    return []
  }
}

export async function buildWithConfig(config: BuildConfig) {
  const { entryPoints, outdir, formats = ['cjs', 'esm'], external, plugins } = config

  const isProd = process.env.NODE_ENV === 'production'
  const isWatch = process.argv.includes('--watch') || process.argv.includes('-w')

  let externalDeps: string[] = []
  if (external === 'auto') {
    externalDeps = getExternalDependencies()
    console.log(`🔍 Automatically detected external dependencies: ${externalDeps.join(', ')}`)
  } else if (Array.isArray(external)) {
    externalDeps = external
  }

  console.log(`🚀 Building ${formats.join(' + ')}...`)
  console.log(`📂 Entry Points: ${entryPoints.join(', ')}`)
  console.log(`📂 Output Directory: ${outdir}`)

  if (isWatch) {
    console.log('👀 Watching for changes...')
  }

  const createBuildOptions = (format: 'cjs' | 'esm') => ({
    entryPoints,
    outdir,
    bundle: true,
    format,
    sourcemap: true,
    external: externalDeps,
    target: 'esnext',
    minify: isProd,
    outExtension: { '.js': format === 'cjs' ? '.cjs' : '.js' },
    plugins
  })

  if (isWatch) {
    try {
      const contexts = await Promise.all(
        formats.map((format) => context(createBuildOptions(format)))
      )

      await Promise.all(contexts.map((ctx) => ctx.rebuild()))
      console.log('🎉 Initial build completed!')

      await Promise.all(contexts.map((ctx) => ctx.watch()))
      console.log('👀 Watching for changes...')

      process.on('SIGINT', async () => {
        console.log('🛑 Stopping watch mode...')
        await Promise.all(contexts.map((ctx) => ctx.dispose()))
        process.exit(0)
      })
    } catch (error) {
      console.error('❌ Watch mode failed:', error)
    }

    return new Promise(() => {})
  } else {
    const buildPromises = formats.map((format) => build(createBuildOptions(format)))

    const results = await Promise.all(buildPromises).catch((error) => {
      console.error('❌ Build failed:', error)
      process.exit(1)
    })

    console.log('✅ Build completed successfully!')
    return results
  }
}
