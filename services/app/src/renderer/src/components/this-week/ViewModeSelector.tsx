import { Inline, Text } from '@illog/ui'
import type { ViewMode } from '../../utils/category-analytics'

const VIEW_MODES: { mode: ViewMode; label: string }[] = [
  { mode: 'project', label: 'By Project' },
  { mode: 'taskType', label: 'By Task Type' },
  { mode: 'subtype', label: 'By Sub Type' }
]

type Props = {
  activeMode: ViewMode
  onSelect: (mode: ViewMode) => void
}

export const ViewModeSelector = ({ activeMode, onSelect }: Props) => {
  return (
    <Inline gap="600" align="center">
      {VIEW_MODES.map(({ mode, label }) => {
        const isActive = mode === activeMode
        return (
          <Text
            key={mode}
            textStyle={isActive ? 'bodyStrong' : 'bodyBase'}
            color={isActive ? 'textBrandDefault' : 'textDefaultTertiary'}
            style={{
              cursor: 'pointer',
              paddingBottom: 4,
              borderBottom: isActive ? '2px solid currentColor' : '2px solid transparent'
            }}
            onClick={() => onSelect(mode)}
          >
            {label}
          </Text>
        )
      })}
    </Inline>
  )
}
