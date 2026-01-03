import { getThisWeekDateRange } from '../utils/time'
import { ContentHeader } from '../components/layout/ContentHeader'
import { useTasksByFilters } from '../hooks/queries'
import { useUserStore } from '../stores/useUserStore'

export const ThisWeek = () => {
  const { timeZone } = useUserStore()
  const { startOfThisWeek, endOfThisWeek } = getThisWeekDateRange(timeZone)

  const { data: tasks } = useTasksByFilters({
    date_from: String(startOfThisWeek),
    date_to: String(endOfThisWeek),
    time_zone: timeZone
  })

  return (
    <>
      <ContentHeader title="This Week's Summary" />
      {tasks && tasks.length > 0 ? (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      ) : (
        <p>No tasks for this week</p>
      )}
    </>
  )
}
