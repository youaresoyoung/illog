import { defineConfig } from 'vite'
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

function copyMigrationsPlugin() {
  return {
    name: 'copy-migrations',
    closeBundle() {
      const srcMigrations = join(__dirname, 'src/main/database/migrations')
      const destMigrations = join(__dirname, '.vite/build/database/migrations')

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
      console.log('Migrations copied to build output')
    }
  }
}

// @google/genai와 하위 의존성은 번들링 시 순환 참조로 Maximum call stack size exceeded 발생
// Rollup 플러그인으로 external 처리 (vite.mergeConfig 병합 문제 우회)
const externalPackages = [
  'better-sqlite3',
  // @google/genai 및 하위 의존성 — 순환 참조로 번들링 불가
  '@google/genai',
  'google-auth-library',
  'gaxios',
  'gcp-metadata',
  'gtoken',
  'google-logging-utils',
  'protobufjs',
  'node-fetch',
  'ws',
  // natural — 거대한 CJS 패키지, 번들링 시 스택 오버플로우 발생
  'natural',
  'string-similarity'
]

function externalPlugin() {
  return {
    name: 'force-external',
    enforce: 'pre' as const,
    resolveId(source: string) {
      if (externalPackages.some((pkg) => source === pkg || source.startsWith(pkg + '/'))) {
        return { id: source, external: true }
      }
      return null
    }
  }
}

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'main.js'
      }
    }
  },
  plugins: [externalPlugin(), copyMigrationsPlugin()],
  resolve: {
    conditions: ['node'],
    mainFields: ['module', 'jsnext:main', 'jsnext']
  }
})
