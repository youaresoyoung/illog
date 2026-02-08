import { app, BrowserWindow } from 'electron'
import path, { join } from 'path'
import windowStateKeeper from 'electron-window-state'
import { resolveIconPath } from '../utils/icon'

// Forge's Vite plugin injects these global variables
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined
declare const MAIN_WINDOW_VITE_NAME: string

export function createWindow(baseDirname: string): BrowserWindow {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1240,
    defaultHeight: 760
  })

  const win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 1240,
    minHeight: 760,
    show: false,
    title: app.getName(),
    icon: resolveIconPath(baseDirname, 'app'),
    webPreferences: {
      sandbox: false, // Need to set it to false to use contextBridge in preload
      preload: path.join(__dirname, 'preload.js'), // Forge Vite plugin compiles preload alongside main
      contextIsolation: true, // Complete isolation between renderer and node.js (CSP level enhancement)
      nodeIntegration: false // Direct use of node.js API in renderer is prohibited
    }
  })

  mainWindowState.manage(win)

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    let retryCount = 0
    const MAX_RETRIES = 3

    win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)

    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.log(`Load failed: ${errorDescription} (${errorCode})`)

      if (retryCount < MAX_RETRIES && !win.isDestroyed()) {
        retryCount++
        setTimeout(() => {
          win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL!)
        }, 500 * retryCount)
      }
    })

    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }
  return win
}
