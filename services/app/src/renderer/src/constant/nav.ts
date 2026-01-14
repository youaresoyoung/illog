export const PAGE_LIST = [
  { id: 'today', iconName: 'calendar_today', label: 'Today', to: '/' },
  { id: 'this-week', iconName: 'calendar_week', label: 'This Week', to: '/this-week' },
  { id: 'reflection', iconName: 'plus', label: 'Reflection', to: '/reflection' }
] as const

export type PageId = (typeof PAGE_LIST)[number]['id']
