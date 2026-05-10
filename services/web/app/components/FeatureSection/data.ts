import { Feature } from './types'

import ImageToday from '@/app/assets/illog/images/today-log.png'
import ImageNote from '@/app/assets/illog/images/note.png'
import ImageThisWeekProject from '@/app/assets/illog/images/this-week-project.png'
import ImageThisWeekTaskType from '@/app/assets/illog/images/this-week-task.png'
import ImageThisWeekSubType from '@/app/assets/illog/images/this-week-sub-type.png'

export const FEATURES: Feature[] = [
  {
    badge: 'Today View',
    title: 'Thoughts are saved\nalongside your work.',
    description:
      "Add today's tasks. Move them from To → In Progress → Done. Not about \"managing\" work — it's about preserving the flow of work. Completed tasks don't disappear. They become the record of your day.",
    imageAlt: 'Today View Screenshot',
    imageSrc: ImageToday
  },
  {
    badge: 'Notes',
    title: 'From tasks to reflection,\none seamless flow.',
    description:
      'Each task can have notes — checklists, code blocks, links, whatever you need. Preserve not just the results, but the process and thinking behind them.',

    imageAlt: 'Notes Editor Screenshot',
    imageSrc: ImageNote
  }
]

export const THIS_WEEK_FEATURES: Feature[] = [
  {
    badge: 'This Week View',
    title: 'Your week at a glance,\nwith project and task insights.',
    description:
      "See your week's work in one view. Group by project, track time spent, and understand your weekly patterns.",
    imageAlt: 'This Week - Project View',
    imageSrc: ImageThisWeekProject
  },
  {
    badge: 'This Week View',
    title: 'Understand where\nyour time actually goes.',
    description:
      'Break down tasks by type. See how much time you spent on development, meetings, reviews, and more.',
    imageAlt: 'This Week - Task Type View',
    imageSrc: ImageThisWeekTaskType
  },
  {
    badge: 'This Week View',
    title: 'Dive deeper into\nyour work patterns.',
    description:
      'Explore sub-type breakdowns for granular insights into how your week was structured.',
    imageAlt: 'This Week - Sub Type View',
    imageSrc: ImageThisWeekSubType
  }
]
