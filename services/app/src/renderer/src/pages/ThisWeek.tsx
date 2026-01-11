import { ContentHeader } from '../components/layout/ContentHeader'
import { useTasksByFilters } from '../hooks/queries'
import { useThisWeekParams } from '../hooks/useThisWeekParams'

export const ThisWeek = () => {
  const { startTime, endTime } = useThisWeekParams()

  const { data: tasks } = useTasksByFilters({
    startTime,
    endTime
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
