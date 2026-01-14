import { useState, useCallback, useEffect } from 'react'
import { Button, Icon, Inline, Stack, Text, Input, useDebouncedCallback } from '@illog/ui'
import {
  useWeeklyReflection,
  useUpdateWeeklyReflection
} from '../../hooks/queries/useWeeklyReflectionQueries'
import { useAllTags } from '../../hooks/queries/useTagQueries'
import type { AccomplishmentItem } from '../../../../shared/types'

type Props = {
  weekId: string
}

export const WeeklyReflection = ({ weekId }: Props) => {
  const { data: reflection } = useWeeklyReflection(weekId)
  const { data: allTags = [] } = useAllTags()
  const { mutate: updateReflection } = useUpdateWeeklyReflection()

  const [accomplishments, setAccomplishments] = useState<AccomplishmentItem[]>([])
  const [improvements, setImprovements] = useState<string[]>([])
  const [nextWeekFocus, setNextWeekFocus] = useState<string[]>([])

  const [newAccomplishment, setNewAccomplishment] = useState('')
  const [newImprovement, setNewImprovement] = useState('')

  useEffect(() => {
    if (reflection) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setAccomplishments(reflection.accomplishments)
      setImprovements(reflection.improvements)
      setNextWeekFocus(reflection.nextWeekFocus)
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [reflection])

  const debouncedSave = useDebouncedCallback(
    (data: {
      accomplishments?: AccomplishmentItem[]
      improvements?: string[]
      nextWeekFocus?: string[]
    }) => {
      updateReflection({ weekId, data })
    },
    1000
  )

  const handleAddAccomplishment = useCallback(() => {
    if (!newAccomplishment.trim()) return
    const newItem: AccomplishmentItem = {
      id: crypto.randomUUID(),
      text: newAccomplishment.trim(),
      completed: false
    }
    const updated = [...accomplishments, newItem]
    setAccomplishments(updated)
    setNewAccomplishment('')
    debouncedSave({ accomplishments: updated })
  }, [newAccomplishment, accomplishments, debouncedSave])

  const handleToggleAccomplishment = useCallback(
    (id: string) => {
      const updated = accomplishments.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
      setAccomplishments(updated)
      debouncedSave({ accomplishments: updated })
    },
    [accomplishments, debouncedSave]
  )

  const handleRemoveAccomplishment = useCallback(
    (id: string) => {
      const updated = accomplishments.filter((item) => item.id !== id)
      setAccomplishments(updated)
      debouncedSave({ accomplishments: updated })
    },
    [accomplishments, debouncedSave]
  )

  const handleAddImprovement = useCallback(() => {
    if (!newImprovement.trim()) return
    const updated = [...improvements, newImprovement.trim()]
    setImprovements(updated)
    setNewImprovement('')
    debouncedSave({ improvements: updated })
  }, [newImprovement, improvements, debouncedSave])

  const handleRemoveImprovement = useCallback(
    (index: number) => {
      const updated = improvements.filter((_, i) => i !== index)
      setImprovements(updated)
      debouncedSave({ improvements: updated })
    },
    [improvements, debouncedSave]
  )

  const handleToggleFocusTag = useCallback(
    (tagId: string) => {
      const updated = nextWeekFocus.includes(tagId)
        ? nextWeekFocus.filter((id) => id !== tagId)
        : [...nextWeekFocus, tagId]
      setNextWeekFocus(updated)
      debouncedSave({ nextWeekFocus: updated })
    },
    [nextWeekFocus, debouncedSave]
  )

  return (
    <Stack gap="600">
      <Text textStyle="bodyStrong" color="textDefaultDefault">
        Weekly Reflection
      </Text>

      <Stack gap="300">
        <Text textStyle="bodyBase" color="textDefaultSecondary">
          Key Accomplishments
        </Text>
        <Stack gap="200">
          {accomplishments.map((item) => (
            <Inline key={item.id} gap="200" align="center">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleAccomplishment(item.id)}
                style={{ cursor: 'pointer' }}
              />
              <Text
                textStyle="bodyBase"
                color={item.completed ? 'textDefaultTertiary' : 'textDefaultDefault'}
                style={{ textDecoration: item.completed ? 'line-through' : 'none', flex: 1 }}
              >
                {item.text}
              </Text>
              <Button variant="secondary" onClick={() => handleRemoveAccomplishment(item.id)}>
                <Icon name="cancel" size="small" />
              </Button>
            </Inline>
          ))}
          <Inline gap="200">
            <Input
              placeholder="Add accomplishment..."
              value={newAccomplishment}
              onChange={(e) => setNewAccomplishment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAccomplishment()}
              style={{ flex: 1 }}
            />
            <Button variant="secondary" onClick={handleAddAccomplishment}>
              Add
            </Button>
          </Inline>
        </Stack>
      </Stack>

      <Stack gap="300">
        <Text textStyle="bodyBase" color="textDefaultSecondary">
          Areas for Improvement
        </Text>
        <Stack gap="200">
          {improvements.map((item, index) => (
            <Inline key={index} gap="200" align="center">
              <Text textStyle="caption" color="textDangerDefault">
                !
              </Text>
              <Text textStyle="bodyBase" color="textDefaultDefault" style={{ flex: 1 }}>
                {item}
              </Text>
              <Button variant="secondary" onClick={() => handleRemoveImprovement(index)}>
                <Icon name="cancel" size="small" />
              </Button>
            </Inline>
          ))}
          <Inline gap="200">
            <Input
              placeholder="Add improvement area..."
              value={newImprovement}
              onChange={(e) => setNewImprovement(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddImprovement()}
              style={{ flex: 1 }}
            />
            <Button variant="secondary" onClick={handleAddImprovement}>
              Add
            </Button>
          </Inline>
        </Stack>
      </Stack>

      <Stack gap="300">
        <Text textStyle="bodyBase" color="textDefaultSecondary">
          Next Week Focus
        </Text>
        <Inline gap="200" wrap="wrap">
          {allTags.map((tag) => (
            <Button
              key={tag.id}
              variant={nextWeekFocus.includes(tag.id) ? 'primary' : 'secondary'}
              onClick={() => handleToggleFocusTag(tag.id)}
            >
              {tag.name}
            </Button>
          ))}
        </Inline>
        {allTags.length === 0 && (
          <Text textStyle="caption" color="textDefaultTertiary">
            No tags available. Create tags in your tasks first.
          </Text>
        )}
      </Stack>
    </Stack>
  )
}
