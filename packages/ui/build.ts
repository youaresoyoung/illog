import { buildWithConfig } from '@illog/esbuild-config'
import { vanillaExtractPlugin } from '@vanilla-extract/esbuild-plugin'
import svgr from 'esbuild-plugin-svgr'

buildWithConfig({
  entryPoints: ['src/index.ts'],
  outdir: 'dist',
  formats: ['cjs', 'esm'],
  external: 'auto',
  plugins: [vanillaExtractPlugin(), svgr()]
})
