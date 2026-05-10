import { useMemo } from 'react'
import {
  Badge,
  BadgeSelector,
  Divider,
  useBadgeSelectorContext,
  type BadgeItem,
  type OmittedBadgeItem,
  Stack
} from '@illog/ui'
import { useAllProjects } from '../../hooks/queries/useProjectQueries'

type Props = {
  selectedProjectId: string | null
  onSelect: (projectId: string | null) => void
}

const ProjectBadgeTrigger = ({ project }: { project: BadgeItem | null }) => {
  const { isOpen } = useBadgeSelectorContext()

  return (
    <Stack>
      {project ? (
        <Badge item={project} isOpenedSelector={isOpen} />
      ) : (
        <Badge
          item={{ name: 'Select Project', color: 'gray' }}
          isOpenedSelector={isOpen}
          addButtonVariant={'default'}
        />
      )}
    </Stack>
  )
}

export const ProjectSelector = ({ selectedProjectId, onSelect }: Props) => {
  const { data: projects = [] } = useAllProjects()

  const projectList = useMemo(() => projects as BadgeItem[], [projects])

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null
    const found = projects.find((p) => p.id === selectedProjectId)
    return found ? (found as BadgeItem) : null
  }, [selectedProjectId, projects])

  const handleSelectProject = async (projectId: string) => {
    onSelect(projectId)
  }

  const handleClearProject = async () => {
    onSelect(null)
  }

  // Required by BadgeSelector.Root but not used for insights
  const noop = async () => ''
  const noopUpdate = async () => {}
  const noopDelete = async () => {}

  return (
    <BadgeSelector.Root
      items={projectList}
      selectedItem={selectedProject}
      onSelectItem={handleSelectProject}
      onClearItem={handleClearProject}
      onCreateItem={noop as (data: Partial<OmittedBadgeItem>) => Promise<string>}
      onDeleteItem={noopDelete}
      onUpdateItem={noopUpdate as (id: string, data: Partial<OmittedBadgeItem>) => Promise<void>}
    >
      <BadgeSelector.Trigger asChild>
        <ProjectBadgeTrigger project={selectedProject} />
      </BadgeSelector.Trigger>

      <BadgeSelector.Content>
        <BadgeSelector.Search placeholder="Search projects..." />
        <Divider />
        <BadgeSelector.List />
      </BadgeSelector.Content>
    </BadgeSelector.Root>
  )
}
