import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import windowStateKeeper from 'electron-window-state'
import { config, isDev } from '../../config/env'

export function createWindow() {
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
    // icon: TODO: Need to update,
    webPreferences: {
      sandbox: false, // Need to set it to false to use contextBridge in preload
      preload: join(__dirname, '../preload/index.js'), // Set a secure preload script path
      contextIsolation: true, // Complete isolation between renderer and node.js (CSP level enhancement)
      nodeIntegration: false // Direct use of node.js API in renderer is prohibited
    }
  })

  mainWindowState.manage(win)

  let retryCount = 0
  const MAX_RETRIES = 3

  if (isDev) {
    win.loadURL(config.devURL)

    win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.log(`Load failed: ${errorDescription} (${errorCode})`)

      if (retryCount < MAX_RETRIES && !win.isDestroyed()) {
        retryCount++
        setTimeout(() => {
          win.loadURL(config.devURL)
        }, 500 * retryCount)
      }
    })

    win.webContents.openDevTools({ mode: 'detach' })
  } else {
    win.loadFile(join(__dirname, '../../out/renderer/index.html'))
  }
  return win
}
