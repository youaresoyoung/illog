import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  test: {
    include: ['src/hooks/**/*.test.ts'],
    environment: 'jsdom'
  },
  optimizeDeps: {
    include: ['@vanilla-extract/recipes/createRuntimeFn']
  }
})
