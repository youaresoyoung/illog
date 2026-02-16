import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src/renderer',
  base: './',
  resolve: {
    alias: {
      // Ensure renderer always resolves the workspace UI build directly.
      '@illog/ui/index.css': path.resolve(__dirname, '../../packages/ui/dist/index.css'),
      '@illog/ui': path.resolve(__dirname, '../../packages/ui/dist/index.js')
    }
  },
  optimizeDeps: {
    // Workspace-linked package exports can drift from Vite's prebundle cache.
    // Exclude to always load the current dist entry directly.
    exclude: ['@illog/ui']
  },
  build: {
    outDir: path.resolve(__dirname, '.vite/renderer/main_window'),
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2022'
  },
  server: {
    port: 5173,
    strictPort: true,
    host: '127.0.0.1'
  }
})
