import { existsSync } from 'fs'
import { getAssetPath } from './path'

type IconType = 'app' | 'tray'

type PlatformIconMap = Partial<Record<NodeJS.Platform, Record<IconType, string[]>>>

/**
 * Runtime icon paths — nativeImage only supports PNG and JPEG.
 * .icns/.ico are NOT loadable via nativeImage.createFromPath().
 * .icns is only used by electron-builder for the macOS app bundle icon.
 *
 * macOS tray: must use "Template" naming convention for auto dark/light mode.
 *             Electron automatically picks up @2x variant if present.
 *             Recommended sizes: 16x16 (1x), 32x32 (2x)
 *             or 22x22 (1x), 44x44 (2x) for tray.
 */
const platformIconSegments: PlatformIconMap = {
  darwin: {
    app: ['icons', 'darwin', 'app.png'],
    tray: ['icons', 'darwin', 'trayTemplate.png']
  },
  linux: {
    app: ['icons', 'linux', 'app-256.png'],
    tray: ['icons', 'linux', 'tray.png']
  },
  win32: {
    app: ['icons', 'win32', 'app.png'],
    tray: ['icons', 'win32', 'tray.png']
  }
}

// Fallback: 1024x1024 PNG that works on all platforms
const defaultIconSegments: Record<IconType, string[]> = {
  app: ['icons', 'iconTemplate.png'],
  tray: ['icons', 'trayTemplate.png']
}

function resolveSegments(type: IconType): string[] {
  const platform = process.platform
  return platformIconSegments[platform]?.[type] ?? defaultIconSegments[type]
}

/**
 * Resolve icon path at runtime (dev & packaged).
 * Always returns a PNG path that nativeImage can load.
 */
export function resolveIconPath(baseDirname: string, type: IconType): string {
  const segments = resolveSegments(type)
  const iconPath = getAssetPath(baseDirname, ...segments)

  if (existsSync(iconPath)) {
    return iconPath
  }

  // Fallback to cross-platform default
  const fallbackSegments = defaultIconSegments[type]
  const fallbackIconPath = getAssetPath(baseDirname, ...fallbackSegments)

  if (!existsSync(fallbackIconPath)) {
    console.warn(
      `[icon] Icon not found for type "${type}" on "${process.platform}". ` +
        `Checked: ${iconPath}, ${fallbackIconPath}`
    )
    return iconPath
  }

  return fallbackIconPath
}
