import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    svgr({
      svgrOptions: {
        exportType: 'default'
      },
      include: '**/*.svg'
    })
  ],
  resolve: {
    alias: {
      'packages/themes/dist': path.resolve(__dirname, '../themes/dist')
    }
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts']
  },
  optimizeDeps: {
    include: ['@vanilla-extract/recipes/createRuntimeFn']
  }
})
