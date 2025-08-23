export default {
  main: {
    build: {
      outDir: './dist/main',
      rollupOptions: {
        external: ['better-sqlite3']
      }
    }
  },
  preload: {
    build: {
      outDir: './dist/preload',
      rollupOptions: {
        external: ['better-sqlite3']
      }
    }
  },
  renderer: {
    build: {
      outDir: './dist/renderer'
    }
  }
}
