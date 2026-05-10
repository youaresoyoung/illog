import { BrowserWindow } from 'electron'
import { autoUpdater } from 'electron'
import log from 'electron-log'

export interface UpdaterConfig {
  feedURL: string
  mainWindow: BrowserWindow | null
}

export class AppUpdater {
  private mainWindow: BrowserWindow | null
  private updateAvailable = false
  private isDevelopment: boolean
  private feedURL: string | null

  constructor(config: UpdaterConfig) {
    this.mainWindow = config.mainWindow
    this.isDevelopment = process.env.NODE_ENV === 'development'
    this.feedURL = this.normalizeFeedUrl(config.feedURL)

    if (this.isDevelopment) {
      log.info('Running in development mode - skipping autoUpdater setup')
      return
    }

    try {
      if (!this.feedURL) {
        log.warn('Feed URL missing - autoUpdater disabled')
        return
      }

      autoUpdater.setFeedURL({
        url: this.feedURL,
        serverType: 'json'
      })

      this.setupListeners()
    } catch (err) {
      log.error('Failed to initialize autoUpdater:', err)
    }
  }

  private setupListeners() {
    autoUpdater.on('error', (err) => {
      log.error('Update error:', err)
    })

    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for update...')
    })

    autoUpdater.on('update-available', () => {
      log.info('Update available')
      this.updateAvailable = true
      this.notifyRenderer()
    })

    autoUpdater.on('update-not-available', () => {
      log.info('Update not available')
      this.updateAvailable = false
    })

    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      log.info('Update downloaded')
      this.showUpdateDialog(releaseNotes, releaseName)
    })
  }

  private notifyRenderer() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('update-available')
    }
  }

  private showUpdateDialog(releaseNotes: string, releaseName: string) {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) {
      return
    }

    this.mainWindow.webContents.send('update-downloaded', {
      releaseNotes,
      releaseName
    })
  }

  public checkForUpdates() {
    if (this.isDevelopment) {
      log.info('Skip update check in development mode')
      return
    }

    if (!this.feedURL) {
      log.warn('Feed URL missing - skip update check')
      return
    }

    try {
      autoUpdater.checkForUpdates()
    } catch (err) {
      log.error('Failed to check for updates:', err)
    }
  }

  public quitAndInstall() {
    if (this.isDevelopment) {
      log.warn('Cannot quit and install in development mode')
      return
    }
    autoUpdater.quitAndInstall()
  }

  public setMainWindow(window: BrowserWindow | null) {
    this.mainWindow = window
  }

  private normalizeFeedUrl(feedURL: string): string | null {
    if (!feedURL) {
      return null
    }

    const trimmed = feedURL.trim()
    if (!trimmed) {
      return null
    }

    if (trimmed.endsWith('/RELEASES.json') || trimmed.endsWith('/releases.json')) {
      return trimmed
    }

    return `${trimmed.replace(/\/+$/, '')}/RELEASES.json`
  }

  /**
   * For testing the update dialog in development mode
   * Can be called from DevTools console with window.api.updater.simulateUpdate()
   */
  public simulateUpdate() {
    if (!this.isDevelopment) {
      log.warn('simulateUpdate is only available in development mode')
      return
    }

    log.info('Simulating update download for testing')
    this.showUpdateDialog(
      'This is a simulated update for testing purposes.',
      'Version 999.9.9 (Simulated)'
    )
  }
}
