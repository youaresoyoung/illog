import { app } from 'electron'
import path from 'path'

/**
 * - Packaged: process.resourcesPath/assets/...
 * - Development: resolve from project root to src/main/assets
 */
export function getAssetPath(baseDirname: string, ...segments: string[]) {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'assets', ...segments)
  }

  // In dev mode, __dirname points to '.vite/build' (Forge Vite plugin output).
  // Assets live in 'src/main/assets', so resolve from app root.
  const appRoot = path.resolve(baseDirname, '..', '..')
  return path.join(appRoot, 'src', 'main', 'assets', ...segments)
}
