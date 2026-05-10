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
const childEntitlementsPath = path.join(entitlementsRoot, 'app.child.entitlements.plist')

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

  // .vite 출력물과 런타임 설정 파일만 포함하고 나머지는 제외
  // 런타임 node_modules는 afterCopy에서 workspace 루트 기준으로 복사
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
          // services/app/package.json의 dependencies 트리만 runtime node_modules에 복사
          const appPackageJsonPath = path.resolve(__dirname, 'package.json')
          const appPackageJson = JSON.parse(fs.readFileSync(appPackageJsonPath, 'utf-8')) as {
            dependencies?: Record<string, string>
          }
          const runtimeDeps = Object.keys(appPackageJson.dependencies ?? {})
          const rootNodeModules = path.resolve(__dirname, '..', '..', 'node_modules')
          const destNodeModules = path.join(buildPath, 'node_modules')

          if (runtimeDeps.length === 0) {
            throw new Error(
              'No runtime dependencies found in services/app/package.json dependencies.'
            )
          }

          fs.mkdirSync(destNodeModules, { recursive: true })
          const copied = new Set<string>()
          const copyModuleTree = (moduleName: string) => {
            if (copied.has(moduleName)) return
            copied.add(moduleName)

            const srcModulePath = path.join(rootNodeModules, moduleName)
            const destModulePath = path.join(destNodeModules, moduleName)

            if (!fs.existsSync(srcModulePath)) {
              throw new Error(
                `Missing module "${moduleName}" in workspace node_modules (${srcModulePath}). Run "pnpm install" before packaging.`
              )
            }

            fs.cpSync(srcModulePath, destModulePath, { recursive: true, force: true })

            const dependencyPackageJsonPath = path.join(srcModulePath, 'package.json')
            if (!fs.existsSync(dependencyPackageJsonPath)) return

            const dependencyPackageJson = JSON.parse(
              fs.readFileSync(dependencyPackageJsonPath, 'utf-8')
            ) as {
              dependencies?: Record<string, string>
              optionalDependencies?: Record<string, string>
            }

            for (const childDep of Object.keys(dependencyPackageJson.dependencies ?? {})) {
              copyModuleTree(childDep)
            }
            for (const optionalDep of Object.keys(
              dependencyPackageJson.optionalDependencies ?? {}
            )) {
              copyModuleTree(optionalDep)
            }
          }

          for (const runtimeDep of runtimeDeps) {
            copyModuleTree(runtimeDep)
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

        // afterCopy는 Forge의 @electron/rebuild 단계 이후에 실행됨.
        // 따라서 여기서 복사된 네이티브 모듈을 타겟 Electron 버전 + 아키텍처에 맞게 리빌드해야 함.
        // 이 없으면 CI에서 빌드한 .node 바이너리가 누락되거나 잘못된 ABI로 패키징됨.
        import('@electron/rebuild')
          .then(({ rebuild }) =>
            rebuild({
              buildPath,
              electronVersion,
              arch,
              onlyModules: ['better-sqlite3']
            })
          )
          .then(() => {
            console.log(
              `Rebuilt better-sqlite3 for Electron ${electronVersion} (${platform}/${arch})`
            )
            done()
          })
          .catch((err: Error) => {
            console.error('Failed to rebuild native modules:', err)
            done(err)
          })
      }
    ],
    protocols: [
      {
        name: 'Illog Link',
        schemes: ['illog']
      }
    ],
    extraResource: [
      './src/main/assets',
      // .env.production is optional - created from secrets in CI
      ...(fs.existsSync(path.resolve(__dirname, '.env.production')) ? ['./.env.production'] : [])
    ],
    osxSign: process.env.APPLE_ID
      ? {
          identity: 'Developer ID Application',
          optionsForFile: (filePath: string) => {
            const isMainBinary =
              filePath.endsWith('.app') ||
              filePath.endsWith('illog') ||
              (!filePath.includes('Helper') && !filePath.includes('helper'))
            return {
              entitlements: isMainBinary ? appEntitlementsPath : childEntitlementsPath
            }
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
        title: 'illog-installer',
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
