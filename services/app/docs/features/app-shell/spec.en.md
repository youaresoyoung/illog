# App Shell — Feature Specification

## 1. Overview

Everything that forms the application's **outer structure**: the desktop window, system tray, application menu, screen layout and routing, and dark/light theming.

## 2. Purpose and User Value

- Deliver desktop-native behavior (remembered window geometry, tray residency, system menus).
- Provide a consistent structure for navigating between screens and opening the detail panel.
- Match the OS appearance setting automatically.

## 3. Functional Requirements

| ID          | Feature               | Description                                                                 |
| ----------- | --------------------- | --------------------------------------------------------------------------- |
| FR-SHELL-01 | Create main window    | Creates the main window once the app is ready.                              |
| FR-SHELL-02 | Remember window state | Persists window position and size and restores them on the next launch.     |
| FR-SHELL-03 | System tray           | Registers a tray icon and context menu.                                     |
| FR-SHELL-04 | Application menu      | Builds a platform-appropriate menu.                                         |
| FR-SHELL-05 | Routing               | Switches between four screens using a hash-based router.                    |
| FR-SHELL-06 | Left navigation       | Renders the logo, screen list, and settings button in a fixed panel.        |
| FR-SHELL-07 | Detail panel          | Shows task detail in a right-hand overlay panel.                            |
| FR-SHELL-08 | Theme sync            | Detects OS dark-mode changes and switches the app theme.                    |
| FR-SHELL-09 | macOS behavior        | Follows macOS conventions such as Dock icon setup and window recreation.    |
| FR-SHELL-10 | Dev-mode support      | Supports dev-server connection, DevTools, and the React DevTools extension. |

## 4. Window Specification

| Item                 | Value                                            |
| -------------------- | ------------------------------------------------ |
| Default size         | 1240 × 760                                       |
| Minimum size         | 1240 × 760                                       |
| Initial visibility   | Created hidden, shown once the renderer is ready |
| Window title         | Application name                                 |
| Geometry persistence | Saved and restored via `electron-window-state`   |

### 4.1 Development vs production loading

| Mode        | Behavior                                                                                                                                                                                            |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Development | Loads the Vite dev server URL. On load failure it retries **up to 3 times** with a backoff of `500ms × attempt`. Opens DevTools in a detached window. Installs the React Developer Tools extension. |
| Production  | Loads the built renderer HTML file.                                                                                                                                                                 |

### 4.2 macOS-specific behavior

| Behavior           | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| Dock icon          | Sets the app icon file as the Dock icon.                   |
| All windows closed | The app does not quit (other platforms do).                |
| Dock icon click    | Recreates the main window and tray when no window is open. |

## 5. System Tray

| Item           | Value                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| Icon           | Dedicated tray icon; on macOS it is set as a template image so it adapts to dark/light automatically |
| Tooltip        | Application name                                                                                     |
| Highlight mode | `always` on macOS                                                                                    |
| Context menu   | `Open illog` / separator / `Quit`                                                                    |
| Icon click     | Focuses the window when visible, shows it when hidden                                                |
| `Open illog`   | Restores from minimized, then shows and focuses                                                      |

The tray instance is managed as a singleton so it is never created twice.

## 6. Application Menu

| Menu         | Items                                                                   | Notes         |
| ------------ | ----------------------------------------------------------------------- | ------------- |
| App name     | About / Services / Hide / Hide Others / Unhide / Quit                   | macOS only    |
| Edit         | Undo, Redo, Cut, Copy, Paste                                            | All platforms |
| Edit (extra) | Paste and Match Style, Delete, Select All, Speech (Start/Stop Speaking) | macOS         |
| Edit (extra) | Delete, Select All                                                      | Non-macOS     |
| View         | Reload, Force Reload, Reset Zoom, Zoom In, Zoom Out, Toggle Fullscreen  | All platforms |
| Window       | Minimize, Close                                                         | All platforms |

Every item uses Electron's built-in roles.

## 7. Screen Structure and Routing

### 7.1 Routes

The router is **hash-based** (`createHashRouter`).

| Path          | Screen     | Nav label   | Icon             |
| ------------- | ---------- | ----------- | ---------------- |
| `/`           | Today      | `Today`     | `calendar_today` |
| `/this-week`  | This Week  | `This Week` | `calendar_week`  |
| `/history`    | History    | `History`   | `clock`          |
| `/projects`   | Projects   | `Projects`  | `folder`         |
| `/reflection` | Reflection | —           | —                |

Both the `/reflection` route and its navigation entry are commented out and unreachable.

### 7.2 Layout

```
┌────────────┬──────────────────────────────┬─────────────────┐
│ LeftPanel  │        MainContent           │   RightPanel    │
│ (fixed 256)│      (centered, 960px)       │ (overlay 720px) │
│            │                              │                 │
│ [logo] [⚙] │  <Outlet />                  │  Task detail    │
│            │                              │  - status       │
│ Today      │                              │  - project/type │
│ This Week  │                              │  - title/desc   │
│ History    │                              │  - tags / time  │
│ Projects   │                              │  - note editor  │
│            │                              │  - AI reflection│
└────────────┴──────────────────────────────┴─────────────────┘
```

- Left panel: logo (swapped between light/dark images by theme), screen list, settings button
- Main area: 256px left offset, 960px wide and centered, with top padding
- Right panel: overlay with a `slideRight` animation, rendered only when a task is selected

### 7.3 Global UI state

| State                      | Purpose                                         |
| -------------------------- | ----------------------------------------------- |
| `currentTaskId`            | ID of the task shown in the detail panel        |
| `isTaskNoteOpen`           | Whether the detail panel is open                |
| `currentSelectedProjectId` | Project selected on the project insights screen |
| `isDarkMode`               | Whether dark mode is active                     |

## 8. Theming

| Aspect              | Behavior                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Initial value       | Determined by the `prefers-color-scheme` media query                                     |
| OS change detection | The main process watches `nativeTheme` and sends a `theme.changed` event to the renderer |
| Application         | Toggles a `theme-dark` class on the document root                                        |
| Logo                | Swaps between light and dark logo images by theme                                        |

- There is no in-app manual theme toggle; the app follows the OS setting.

## 9. Application Lifecycle

```
App start
  → (Windows) handle Squirrel install events
  → initialize Sentry
  → app.whenReady()
      → (dev) install React DevTools
      → register nativeTheme change listener
      → open DB + run migrations + seed
      → wire repositories / services / IPC handlers
      → emit app_launched analytics event
      → configure CSP
      → build application menu
      → (macOS) set Dock icon
      → create main window
      → initialize auto-updater and check for updates
      → create tray
App quit (before-quit)
  → shut down analytics service (flush)
  → shut down crash report service (flush)
```

## 10. Related Features

- Database initialization: [`data-storage`](../data-storage/spec.en.md)
- CSP and context isolation: [`security`](../security/spec.en.md)
- Auto update: [`auto-update`](../auto-update/spec.en.md)
- Settings dialog: [`settings-onboarding`](../settings-onboarding/spec.en.md)

## 11. Current Limitations and Future Work

- The deep-link interface (`events.onDeepLink`) is exposed in preload, but nothing in the main process ever sends a `deep-link` event, so it is non-functional.
- The theme cannot be toggled manually from within the app.
- The left navigation cannot be collapsed or resized.
- There is no "keep running in tray on close" (background) option.
- There are no global shortcuts.
- Multiple windows are unsupported.
- The main content is fixed at 960px, so wide displays are underused.
- The `theme_changed` analytics event constant is defined but never emitted.
