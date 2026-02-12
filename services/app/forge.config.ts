import * as fs from 'fs'
import * as path from 'path'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { FuseV1Options, FuseVersion } from '@electron/fuses'
import { VitePlugin } from '@electron-forge/plugin-vite'
import type { ForgeConfig } from '@electron-forge/shared-types'
import * as dotenv from 'dotenv'

const envLocalPath = path.resolve(process.cwd(), '.env.local')

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: false })
}

const platformIconCandidates: Record<string, string[][]> = {
  darwin: [
    ['icons', 'darwin', 'app.icns'],
    ['icons', 'darwin', 'app.png']
  ],
  win32: [
    ['icons', 'win32', 'app.ico'],
    ['icons', 'win32', 'app.png']
  ],
  linux: [['icons', 'linux', 'app.png']]
}

const defaultIconCandidates = [['iconTemplate.png']]

function resolvePackagerIcon(): string {
  const assetRoot = path.resolve(process.cwd(), 'src', 'main', 'assets')
  const candidateSegments = platformIconCandidates[process.platform] ?? defaultIconCandidates

  for (const segments of candidateSegments) {
    const candidate = path.join(assetRoot, ...segments)
    if (fs.existsSync(candidate)) {
      const ext = path.extname(candidate)
      if (ext === '.icns') {
        return candidate.slice(0, -ext.length)
      }
      return candidate
    }
  }

  const [fallbackSegments] = defaultIconCandidates
  return path.join(assetRoot, ...fallbackSegments)
}

const entitlementsRoot = path.resolve(process.cwd(), 'entitlements')
const appEntitlementsPath = path.join(entitlementsRoot, 'app.entitlements.plist')

// const sensitiveIgnorePatterns = [
//   /(^|\/)\.env(\..+)?$/i,
//   /^sql\/sqlite(\/?|$)/i,
//   /^scripts(\/?|$)/i,
//   /\.log$/i,
//   /\.pem$/i,
//   /\.p12$/i,
//   /\.p8$/i,
//   /\.key$/i,
//   /\.sh$/i
// ]

const ignoreSensitiveResources = (filePath: string): boolean => {
  if (!filePath) return false
  const normalized = filePath.replace(/\\/g, '/')

  // .vite 폴더(Vite 번들 출력)와 package.json, .env 파일만 포함, 나머지 모두 제외
  // node_modules는 Vite가 이미 번들에 포함시켰으므로 불필요
  if (
    normalized.startsWith('/.vite') ||
    normalized === '/package.json' ||
    normalized === '/.env.production'
  ) {
    return false // 포함
  }

  return true // 나머지 제외
}

const config: ForgeConfig = {
  packagerConfig: {
    appBundleId: 'com.electron.illog',
    executableName: 'illog',
    asar: true,
    prune: false,
    icon: resolvePackagerIcon(),
    ignore: ignoreSensitiveResources,
    afterCopy: [
      (
        buildPath: string,
        electronVersion: string,
        platform: string,
        arch: string,
        done: (err?: Error) => void
      ) => {
        try {
          // pnpm 워크스페이스에서 호이스팅된 모듈을 빌드 경로로 복사
          // - 네이티브 모듈: Vite가 번들링할 수 없음
          // - 순환 참조 모듈: 번들링 시 Maximum call stack size exceeded 발생
          const externalModules = [
            'better-sqlite3',
            '@google/genai',
            'natural',
            'string-similarity'
          ]
          const rootNodeModules = path.resolve(__dirname, '..', '..', 'node_modules')
          const destNodeModules = path.join(buildPath, 'node_modules')

          // natural 패키지의 불필요한 의존성 (DB adapters, 서버 등) 제외
          const skipModules = new Set([
            'mongoose',
            'mongodb',
            'pg',
            'redis',
            'memjs',
            'http-server',
            'bson',
            'kareem',
            'mpath',
            'mquery',
            'sift'
          ])

          // 모듈과 하위 의존성 트리를 재귀적으로 복사
          const copied = new Set<string>()
          function copyModuleTree(modName: string, depth = 0) {
            if (copied.has(modName) || skipModules.has(modName)) return
            copied.add(modName)

            const src = path.join(rootNodeModules, modName)
            const dest = path.join(destNodeModules, modName)

            if (!fs.existsSync(src)) {
              console.warn(`${'  '.repeat(depth)}Warning: module not found: ${modName}`)
              return
            }

            fs.cpSync(src, dest, { recursive: true })

            // 하위 dependencies 재귀 복사
            const modPkgPath = path.join(src, 'package.json')
            if (fs.existsSync(modPkgPath)) {
              const modPkg = JSON.parse(fs.readFileSync(modPkgPath, 'utf-8'))
              for (const dep of Object.keys(modPkg.dependencies || {})) {
                copyModuleTree(dep, depth + 1)
              }
            }
          }

          for (const mod of externalModules) {
            copyModuleTree(mod)
          }

          // natural 패키지가 require()하는 storage 관련 모듈의 스텁 생성
          // 실제로 사용하지 않지만 require() 실패를 방지
          for (const stubMod of skipModules) {
            const stubDir = path.join(destNodeModules, stubMod)
            if (!fs.existsSync(stubDir)) {
              fs.mkdirSync(stubDir, { recursive: true })
              fs.writeFileSync(
                path.join(stubDir, 'package.json'),
                JSON.stringify({ name: stubMod, version: '0.0.0', main: 'index.js' })
              )
              fs.writeFileSync(
                path.join(stubDir, 'index.js'),
                `module.exports = new Proxy({}, { get: () => { throw new Error('${stubMod} is not available in packaged app'); } });`
              )
              console.log(`Created stub module: ${stubMod}`)
            }
          }

          // 프로덕션 환경변수 파일을 빌드 경로에 복사
          // env.ts의 loadEnvFiles()가 computeSearchRoots()로 탐색
          const envSource = path.resolve(__dirname, '.env.production')
          if (fs.existsSync(envSource)) {
            fs.copyFileSync(envSource, path.join(buildPath, '.env.production'))
            fs.copyFileSync(envSource, path.join(buildPath, '.env'))
            console.log('Copied .env.production to build path')
          } else {
            console.warn('Warning: .env.production not found — packaged app will have no env vars')
          }
        } catch (err) {
          done(err as Error)
          return
        }
        done()
      }
    ],
    protocols: [
      {
        name: 'Illog Link',
        schemes: ['illog']
      }
    ],
    extraResource: ['./src/main/assets', './.env.production'],
    osxSign: process.env.APPLE_ID
      ? {
          optionsForFile: () => {
            return { entitlements: appEntitlementsPath }
          }
        }
      : undefined,
    osxNotarize:
      process.env.APPLE_ID && process.env.APPLE_ID_PASSWORD
        ? {
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_ID_PASSWORD,
            teamId: process.env.APPLE_TEAM_ID!
          }
        : undefined
  },
  rebuildConfig: {},

  makers: [
    {
      name: '@electron-forge/maker-dmg',
      config: {
        title: 'illog Installer',
        format: 'ULFO',
        icon: path.resolve('src/main/assets/icons/darwin/app.icns')
      }
    },
    { name: '@electron-forge/maker-squirrel', config: {} },
    {
      name: '@electron-forge/maker-zip',
      config: (arch: string) => ({
        ...(process.env.AWS_CLOUDFRONT_DOMAIN && {
          macUpdateManifestBaseUrl: `https://${process.env.AWS_CLOUDFRONT_DOMAIN}/updates/darwin/${arch}`
        })
      })
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-s3',
      config: {
        bucket: 'illog',
        region: 'us-east-2',
        keyResolver: (filename: string, platform: string, arch: string) => {
          return `updates/${platform}/${arch}/${filename}`
        }
      }
    }
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/main/index.ts',
          config: 'vite.main.config.ts',
          target: 'main'
        },
        {
          entry: 'src/preload/index.ts',
          config: 'vite.preload.config.ts',
          target: 'preload'
        }
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts'
        }
      ]
    }),
    { name: '@electron-forge/plugin-auto-unpack-natives', config: {} },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true
    })
  ]
}

export default config
