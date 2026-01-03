import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

function copyMigrationsPlugin() {
  return {
    name: 'copy-migrations',
    closeBundle() {
      const srcMigrations = join(__dirname, 'src/main/database/migrations')
      const destMigrations = join(__dirname, 'out/main/database/migrations')

      function copyDir(src: string, dest: string) {
        mkdirSync(dest, { recursive: true })
        const entries = readdirSync(src)

        for (const entry of entries) {
          const srcPath = join(src, entry)
          const destPath = join(dest, entry)

          if (statSync(srcPath).isDirectory()) {
            copyDir(srcPath, destPath)
          } else {
            copyFileSync(srcPath, destPath)
          }
        }
      }

      copyDir(srcMigrations, destMigrations)
      console.log('✅ Migrations copied to build output')
    }
  }
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), copyMigrationsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {}
})
