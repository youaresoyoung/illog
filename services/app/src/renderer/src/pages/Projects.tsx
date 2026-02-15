import { Stack, Text, Box } from '@illog/ui'
import { ContentHeader } from '../components/layout/ContentHeader'
import { OverviewCards } from '../components/project-insights/OverviewCards'
import { TaskTypeAnalysis } from '../components/project-insights/TaskTypeAnalysis'
import { SubtypeTable } from '../components/project-insights/SubtypeTable'
import { ProjectList } from '../components/projects/ProjectList'
import { useProjects } from '../hooks/useProjects'
import type { ReactNode } from 'react'
import { ProjectTaskCardList } from '../components/project-insights/ProjectTaskCardList'

const CONTENT_MARGIN = { marginLeft: 276 }

const Layout = ({ title, children }: { title: string; children: ReactNode }) => (
  <>
    <ProjectList />
    <Stack gap="800" style={CONTENT_MARGIN}>
      <ContentHeader title={title} />
      {children}
    </Stack>
  </>
)

const EmptyState = ({ message }: { message: string }) => (
  <Stack gap="400" align="center" justify="center" mt="2400">
    <Text textStyle="bodyBase" color="textDefaultTertiary">
      {message}
    </Text>
  </Stack>
)

export const Projects = () => {
  const {
    selectedProjectId,
    project,
    tasks,
    isLoading,
    error,
    overviewMetrics,
    taskTypeMetrics,
    subtypeMetrics
  } = useProjects()

  if (!selectedProjectId) {
    return (
      <Layout title="Projects">
        <EmptyState message="Select a project to view insights" />
      </Layout>
    )
  }

  if (isLoading) {
    return (
      <Layout title="Projects">
        <Box px="600" py="400">
          <Text textStyle="bodyBase" color="textDefaultTertiary">
            Loading...
          </Text>
        </Box>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout title="Projects">
        <Box px="600" py="400">
          <Text textStyle="bodyBase" color="textDefaultTertiary">
            Error loading tasks: {error instanceof Error ? error.message : 'Unknown error'}
          </Text>
        </Box>
      </Layout>
    )
  }

  if (tasks.length === 0) {
    return (
      <Layout title="Projects">
        <EmptyState message="No tasks yet" />
      </Layout>
    )
  }

  return (
    <Layout title={`Projects: ${project?.name ?? 'Loading...'}`}>
      <OverviewCards metrics={overviewMetrics} />
      <TaskTypeAnalysis metrics={taskTypeMetrics} />
      {subtypeMetrics.length > 0 && <SubtypeTable metrics={subtypeMetrics} />}
      <ProjectTaskCardList tasks={tasks} />
    </Layout>
  )
}
