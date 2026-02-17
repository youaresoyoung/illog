import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

if (process.platform !== 'darwin') {
  process.exit(0)
}

const scriptDir = dirname(fileURLToPath(import.meta.url))
const workspaceRoot = resolve(scriptDir, '..', '..', '..')
const nodeHome = resolve(process.execPath, '..', '..')
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const result = spawnSync(npmCommand, ['rebuild', 'macos-alias', 'fs-xattr'], {
  cwd: workspaceRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    // NOTE: Reuse the active Node installation instead of downloading headers.
    npm_config_nodedir: nodeHome,
    npm_config_devdir: resolve(workspaceRoot, '.node-gyp-cache')
  }
})

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
