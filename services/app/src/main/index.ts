import { app, BrowserWindow, nativeImage } from 'electron'
import { openDB } from './db'
import { installExtension, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import { CrashReportService, initSentryEarly } from './service/CrashReportService'
import { createWindow } from './window'
import { isDev } from '../config/env'
import { buildMenu } from './menu'
import { registerHandlers } from './controller/registerHandlers'
import { createAppTray } from './tray/appTray'
import { resolveIconPath } from './utils/icon'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { setupCSP } from './security/csp'

initSentryEarly()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let crashReportServiceInstance: CrashReportService | null = null
let mainWindow: BrowserWindow | null = null

app.whenReady().then(() => {
  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((ext) => console.log(`Added Extension:  ${ext.name}`))
      .catch((err) => console.log('An error occurred: ', err))
  }
  // TODO: need to consider theme change handling (dark mode, light mode, system mode)
  // nativeTheme.on('updated', () => {
  //   const isDark = nativeTheme.shouldUseDarkColors
  //   mainWindow.webContents.send('theme.changed', isDark)
  // })

  const { db } = openDB()

  crashReportServiceInstance = registerHandlers(db)
  setupCSP()
  buildMenu()

  const appIconPath = resolveIconPath(__dirname, 'app')
  if (process.platform === 'darwin' && app.dock) {
    const appIcon = nativeImage.createFromPath(appIconPath)
    if (!appIcon.isEmpty()) {
      app.dock.setIcon(appIcon)
    }
  }

  mainWindow = createWindow(__dirname)
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  createAppTray(__dirname, mainWindow)

  // NOTE: For macOS, re-create a window in the app when the dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow(__dirname)
      mainWindow.on('ready-to-show', () => {
        mainWindow?.show()
      })
      mainWindow.on('closed', () => {
        mainWindow = null
      })
      createAppTray(__dirname, mainWindow)
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', async () => {
  if (crashReportServiceInstance) {
    await crashReportServiceInstance.shutdown()
  }
})
