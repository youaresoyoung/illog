import { app, BrowserWindow, Menu, nativeImage, Tray } from 'electron'
import { resolveIconPath } from '../utils/icon'

let tray: Tray | null = null

export function createAppTray(baseDirname: string, win: BrowserWindow | null) {
  if (tray) {
    return tray
  }

  const trayIconPath = resolveIconPath(baseDirname, 'tray')
  let trayIcon = nativeImage.createFromPath(trayIconPath)
  if (trayIcon.isEmpty()) {
    trayIcon = nativeImage.createEmpty()
  }
  if (process.platform === 'darwin') {
    // NOTE: For macOS, set the tray icon as a template image to support dark/light mode automatically
    trayIcon.setTemplateImage(true)
  }
  tray = new Tray(trayIcon)
  if (process.platform === 'darwin') {
    const macTray = tray as Tray & {
      /**
       * selection: The tray icon background is highlighted only when the user clicks on it. (default)
       * always: The tray icon background is always highlighted when the user clicks on it or when the menu is shown.
       * never: The tray icon background is never highlighted.
       */
      setHighlightMode: (mode: 'selection' | 'always' | 'never') => void
    }
    macTray.setHighlightMode?.('always')
  }
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open illog',
      click: () => {
        if (win) {
          if (win.isMinimized()) win.restore()
          win.show()
          win.focus()
        }
      }
    },
    { type: 'separator' },
    { label: 'Quit', role: 'quit' }
  ])
  tray.setToolTip(app.getName())
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    if (!win) {
      return
    }
    if (win.isVisible()) {
      win.focus()
    } else {
      win.show()
    }
  })
  return tray
}
