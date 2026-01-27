export const PAGE_LIST = [
  { id: 'today', iconName: 'calendar_today', label: 'Today', to: '/' },
  { id: 'this-week', iconName: 'calendar_week', label: 'This Week', to: '/this-week' },
  // NOTE: History page is temporarily show up until the reflection page is ready, as they will be merged into one page eventually
  { id: 'history', iconName: 'clock', label: 'History', to: '/history' }
  // { id: 'reflection', iconName: 'plus', label: 'Reflection', to: '/reflection' }
] as const

export type PageId = (typeof PAGE_LIST)[number]['id']
