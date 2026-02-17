import { memo, useCallback } from 'react'
import type { Project } from '../../types'
import type { ProjectOverviewMetrics } from '../../utils/project-insights'
import { tokens } from '@illog/themes'
import { Stack, Inline, Text, HorizontalBar } from '@illog/ui'

type Props = {
  project: Project
  overview: ProjectOverviewMetrics
  isSelected: boolean
  onSelect: (id: string) => void
}

export const ProjectItem = memo(({ project, overview, isSelected, onSelect }: Props) => {
  const handleClick = useCallback(() => onSelect(project.id), [onSelect, project.id])

  return (
    <Stack
      as="button"
      gap="200"
      bg="backgroundDefaultDefault"
      rounded="400"
      p="400"
      border="border"
      borderColor={isSelected ? 'borderDefaultSecondary' : 'borderDefaultDefault'}
      borderStyle="solid"
      onClick={handleClick}
    >
      <Inline justify="space-between">
        <Text textStyle="bodySmallStrong" truncate="true">
          {project.name}
        </Text>
        <Text as="span" textStyle="caption" color="textBrandTertiary" flexShrink={0}>
          ({overview.completionRate.toFixed(0)} %)
        </Text>
      </Inline>
      <HorizontalBar
        value={overview.completionRate}
        max={100}
        height={8}
        trackColor={tokens.colors.light.background.brand.tertiary}
        fillColor={tokens.colors.light.text.tag[project.color]}
      />
    </Stack>
  )
})

ProjectItem.displayName = 'ProjectItem'
