/**
 * Generate all platform-specific icons from SVG source files.
 *
 * Usage: npx tsx scripts/generate-icons.ts
 *
 * Source files:
 *   - src/main/assets/icons/icon/app.svg  → app icons for all platforms
 *   - src/main/assets/icons/icon/tray.svg → tray icons for all platforms
 *
 * Output structure:
 *   src/main/assets/icons/
 *   ├── darwin/
 *   │   ├── app.icns              ← macOS app bundle (electron-builder)
 *   │   ├── app.png               ← 512x512, runtime dock/window icon
 *   │   ├── trayTemplate.png      ← 22x22, tray 1x (Template = auto dark/light)
 *   │   └── trayTemplate@2x.png   ← 44x44, tray 2x
 *   ├── win32/
 *   │   ├── app.ico               ← Windows app icon (multi-size ICO)
 *   │   ├── app.png               ← 256x256, runtime window icon
 *   │   ├── tray.ico              ← Windows tray icon (multi-size ICO)
 *   │   └── tray.png              ← 32x32, runtime tray icon
 *   └── linux/
 *       ├── app-16.png            ← 16x16
 *       ├── app-32.png            ← 32x32
 *       ├── app-48.png            ← 48x48
 *       ├── app-64.png            ← 64x64
 *       ├── app-128.png           ← 128x128
 *       ├── app-256.png           ← 256x256
 *       ├── app-512.png           ← 512x512 (used as runtime icon)
 *       └── tray.png              ← 24x24 tray icon
 */

import sharp from 'sharp'
import { mkdirSync, existsSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ROOT = join(__dirname, '..')
const ASSETS = join(ROOT, 'src', 'main', 'assets', 'icons')
const APP_SVG = join(ASSETS, 'icon', 'app.svg')
const TRAY_SVG = join(ASSETS, 'icon', 'tray.svg')

function ensureDir(dir: string) {
  mkdirSync(dir, { recursive: true })
}

async function generatePng(svgPath: string, outputPath: string, size: number): Promise<void> {
  await sharp(svgPath).resize(size, size).png().toFile(outputPath)
}

async function generateDarwin() {
  const dir = join(ASSETS, 'darwin')
  ensureDir(dir)

  console.log('🍎 Generating macOS icons...')

  // App icon (512x512 PNG for runtime use)
  await generatePng(APP_SVG, join(dir, 'app.png'), 512)

  // Generate .icns from SVG using sips + iconutil (macOS only)
  if (process.platform === 'darwin') {
    const iconsetDir = join(dir, 'app.iconset')
    ensureDir(iconsetDir)

    const iconsetSizes = [
      { name: 'icon_16x16.png', size: 16 },
      { name: 'icon_16x16@2x.png', size: 32 },
      { name: 'icon_32x32.png', size: 32 },
      { name: 'icon_32x32@2x.png', size: 64 },
      { name: 'icon_128x128.png', size: 128 },
      { name: 'icon_128x128@2x.png', size: 256 },
      { name: 'icon_256x256.png', size: 256 },
      { name: 'icon_256x256@2x.png', size: 512 },
      { name: 'icon_512x512.png', size: 512 },
      { name: 'icon_512x512@2x.png', size: 1024 }
    ]

    await Promise.all(
      iconsetSizes.map(({ name, size }) => generatePng(APP_SVG, join(iconsetDir, name), size))
    )

    try {
      execSync(`iconutil -c icns "${iconsetDir}" -o "${join(dir, 'app.icns')}"`)
      // Clean up iconset directory
      execSync(`rm -rf "${iconsetDir}"`)
      console.log('  ✅ app.icns')
    } catch {
      console.warn('  ⚠️  iconutil failed, keeping existing app.icns if present')
    }
  } else {
    console.log('  ⏭  Skipping .icns generation (not on macOS)')
  }

  console.log('  ✅ app.png (512x512)')

  await generatePng(TRAY_SVG, join(dir, 'trayTemplate.png'), 22)
  await generatePng(TRAY_SVG, join(dir, 'trayTemplate@2x.png'), 44)
  console.log('  ✅ trayTemplate.png (22x22)')
  console.log('  ✅ trayTemplate@2x.png (44x44)')
}

async function generateWin32() {
  const dir = join(ASSETS, 'win32')
  ensureDir(dir)

  console.log('🪟 Generating Windows icons...')

  // App icon PNG (256x256 for runtime BrowserWindow icon)
  await generatePng(APP_SVG, join(dir, 'app.png'), 256)
  console.log('  ✅ app.png (256x256)')

  // Generate a 1024x1024 PNG as source for electron-icon-builder
  const tmpSrcPng = join(dir, '_tmp-src-1024.png')
  await generatePng(APP_SVG, tmpSrcPng, 1024)

  // Build .ico using electron-icon-builder (which also generates .icns, but we only need .ico)
  try {
    const tmpOutputDir = join(dir, '_tmp-ico-output')
    ensureDir(tmpOutputDir)
    execSync(
      `npx electron-icon-builder --input="${tmpSrcPng}" --output="${tmpOutputDir}" --flatten`,
      { cwd: ROOT, stdio: 'pipe' }
    )
    // electron-icon-builder outputs to _tmp-ico-output/icons/icon.ico
    const generatedIco = join(tmpOutputDir, 'icons', 'icon.ico')
    if (existsSync(generatedIco)) {
      const { copyFileSync } = await import('fs')
      copyFileSync(generatedIco, join(dir, 'app.ico'))
      console.log('  ✅ app.ico (multi-size)')
    }
    // Clean up
    execSync(`rm -rf "${tmpOutputDir}"`)
  } catch {
    console.warn('  ⚠️  ICO generation failed. electron-builder will auto-convert from PNG.')
  }

  // Clean up source PNG
  if (existsSync(tmpSrcPng)) unlinkSync(tmpSrcPng)

  // Tray icon (32x32 PNG — Windows tray)
  await generatePng(TRAY_SVG, join(dir, 'tray.png'), 32)
  console.log('  ✅ tray.png (32x32)')
}

async function generateLinux() {
  const dir = join(ASSETS, 'linux')
  ensureDir(dir)

  console.log('🐧 Generating Linux icons...')

  // Linux desktop environments expect multiple sizes
  const sizes = [16, 32, 48, 64, 128, 256, 512]

  await Promise.all(
    sizes.map(async (size) => {
      await generatePng(APP_SVG, join(dir, `app-${size}.png`), size)
    })
  )

  console.log(`  ✅ app-{${sizes.join(',')}}.png`)

  // Tray icon (24x24 — typical Linux system tray size)
  await generatePng(TRAY_SVG, join(dir, 'tray.png'), 24)
  console.log('  ✅ tray.png (24x24)')
}

async function main() {
  if (!existsSync(APP_SVG)) {
    console.error(`❌ Source app SVG not found: ${APP_SVG}`)
    process.exit(1)
  }
  if (!existsSync(TRAY_SVG)) {
    console.error(`❌ Source tray SVG not found: ${TRAY_SVG}`)
    process.exit(1)
  }

  console.log('🎨 Generating platform icons from SVG sources...\n')

  await generateDarwin()
  console.log()
  await generateWin32()
  console.log()
  await generateLinux()

  console.log('\n✨ All platform icons generated successfully!')
  console.log('\nFile structure:')
  execSync(`find "${ASSETS}" -type f | sort`, { stdio: 'inherit' })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
