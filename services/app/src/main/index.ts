import { app, BrowserWindow, nativeImage, nativeTheme } from 'electron'
import { openDB } from './db'
import { installExtension, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import { CrashReportService, initSentryEarly } from './service/CrashReportService'
import type { AnalyticsService } from './service/AnalyticsService'
import { createWindow } from './window'
import { config, isDev } from '../config/env'
import { buildMenu } from './menu'
import { registerHandlers } from './controller/registerHandlers'
import { createAppTray } from './tray/appTray'
import { resolveIconPath } from './utils/icon'
import { setupCSP } from './security/csp'
import { AppUpdater } from './updater/autoUpdater'
import { registerUpdaterHandler } from './ipc/ipcHandlers'
import { APP_LAUNCHED } from '@illog/analytics'

// Handle Squirrel events on Windows (install, update, uninstall)
if (process.platform === 'win32') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  if (require('electron-squirrel-startup')) app.quit()
}

initSentryEarly()

let crashReportServiceInstance: CrashReportService | null = null
let analyticsServiceInstance: AnalyticsService | null = null
let mainWindow: BrowserWindow | null = null
let appUpdater: AppUpdater | null = null

app
  .whenReady()
  .then(() => {
    if (isDev) {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((ext) => console.log(`Added Extension:  ${ext.name}`))
        .catch((err) => console.log('An error occurred: ', err))
    }
    nativeTheme.on('updated', () => {
      const isDark = nativeTheme.shouldUseDarkColors
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('theme.changed', isDark)
      }
    })

    const { db } = openDB()

    const { crashReportService, analyticsService } = registerHandlers(db)
    crashReportServiceInstance = crashReportService
    analyticsServiceInstance = analyticsService

    analyticsService.track(APP_LAUNCHED, {
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch
    })

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

    if (config.cloudfrontDomain || isDev) {
      appUpdater = new AppUpdater({
        feedURL: config.cloudfrontDomain
          ? `https://${config.cloudfrontDomain}/updates/${process.platform}/${process.arch}`
          : '',
        mainWindow
      })
      registerUpdaterHandler({
        quitAndInstall: () => appUpdater?.quitAndInstall(),
        simulateUpdate: () => appUpdater?.simulateUpdate()
      })

      if (!isDev) {
        mainWindow.once('ready-to-show', () => {
          appUpdater?.checkForUpdates()
        })
      }
    }

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
  .catch((err) => {
    console.error('[FATAL] app.whenReady() failed:', err)
  })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', async () => {
  if (analyticsServiceInstance) {
    await analyticsServiceInstance.shutdown()
  }
  if (crashReportServiceInstance) {
    await crashReportServiceInstance.shutdown()
  }
})
