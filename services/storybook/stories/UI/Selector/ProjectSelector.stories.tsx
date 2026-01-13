import { useState, useCallback } from 'react'
import {
  ProjectSelector,
  ProjectBadge,
  Divider,
  Stack,
  useProjectSelectorContext,
  type ProjectType,
  type OmittedProject
} from '@illog/ui'
import { Meta, StoryObj } from '@storybook/react-vite'

const mockProjects: ProjectType[] = [
  {
    id: '1',
    name: 'Website Redesign',
    color: 'blue',
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  },
  {
    id: '2',
    name: 'Mobile App',
    color: 'green',
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  },
  {
    id: '3',
    name: 'API Integration',
    color: 'purple',
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  },
  {
    id: '4',
    name: 'Bug Fixes',
    color: 'red',
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  },
  {
    id: '5',
    name: 'Documentation',
    color: 'yellow',
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  }
]

const ProjectBadgeTrigger = ({ project }: { project: ProjectType | null }) => {
  const { isOpen } = useProjectSelectorContext()

  return (
    <Stack minW="0" overflow="hidden">
      {project ? (
        <ProjectBadge project={project} isOpenedSelector={isOpen} />
      ) : (
        <ProjectBadge
          project={{ name: 'Add Project', color: 'gray' }}
          isOpenedSelector={isOpen}
          addButtonVariant={'default'}
        />
      )}
    </Stack>
  )
}

const ProjectSelectorDemo = ({
  initialProjects = mockProjects,
  initialSelectedProject = null
}: {
  initialProjects?: ProjectType[]
  initialSelectedProject?: ProjectType | null
}) => {
  const [projects, setProjects] = useState<ProjectType[]>(initialProjects)
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(initialSelectedProject)

  const handleSelectProject = useCallback(
    async (projectId: string) => {
      const project = projects.find((p) => p.id === projectId)
      if (project) {
        setSelectedProject(project)
      }
    },
    [projects]
  )

  const handleClearProject = useCallback(async () => {
    setSelectedProject(null)
  }, [])

  const handleCreateProject = useCallback(async (data: Partial<OmittedProject>) => {
    const newProject: ProjectType = {
      id: `new-${Date.now()}`,
      name: data.name || 'New Project',
      color: data.color || 'gray',
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null
    }
    setProjects((prev) => [...prev, newProject])
    return newProject.id
  }, [])

  const handleDeleteProject = useCallback(async (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId))
  }, [])

  const handleUpdateProject = useCallback(
    async (projectId: string, data: Partial<OmittedProject>) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, ...data, updatedAt: new Date() } : p))
      )
    },
    []
  )

  return (
    <div style={{ padding: '20px', maxWidth: '300px' }}>
      <ProjectSelector.Root
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={handleSelectProject}
        onClearProject={handleClearProject}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onUpdateProject={handleUpdateProject}
      >
        <ProjectSelector.Trigger asChild>
          <ProjectBadgeTrigger project={selectedProject} />
        </ProjectSelector.Trigger>

        <ProjectSelector.Content>
          <ProjectSelector.Search placeholder="Search projects..." />
          <Divider />
          <ProjectSelector.List />
        </ProjectSelector.Content>
      </ProjectSelector.Root>
    </div>
  )
}

const meta = {
  title: 'UI/Selector/ProjectSelector',
  component: ProjectSelectorDemo,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    initialSelectedProject: {
      control: 'select',
      options: ['none', ...mockProjects.map((p) => p.name)],
      mapping: {
        none: null,
        ...Object.fromEntries(mockProjects.map((p) => [p.name, p]))
      }
    }
  }
} satisfies Meta<typeof ProjectSelectorDemo>

export default meta
type Story = StoryObj<typeof ProjectSelectorDemo>

export const Default: Story = {
  args: {
    initialProjects: mockProjects,
    initialSelectedProject: null
  }
}

export const WithSelectedProject: Story = {
  args: {
    initialProjects: mockProjects,
    initialSelectedProject: mockProjects[0]
  }
}

export const EmptyList: Story = {
  args: {
    initialProjects: [],
    initialSelectedProject: null
  }
}

export const SingleProject: Story = {
  args: {
    initialProjects: [mockProjects[0]],
    initialSelectedProject: null
  }
}
