import { Box, Text } from '@/app/components/common/UI'
import { getComponentSpec } from '@/lib/spec'

type Prop = {
  name: string
  type: string
  default?: string | null
  required?: boolean
  description: string
}

/**
 * component 를 주면 packages/ui/spec 에서 생성된 표를 그림
 * data 는 아직 스펙이 없는 컴포넌트를 위한 임시 경로
 */
type Props =
  | {
      component: string
      data?: never
    }
  | { component?: never; data: Prop[] }

const headerCellStyle = {
  padding: '0.75rem 1rem',
  textAlign: 'left' as const,
  borderBottom: '2px solid #e5e5e5',
  whiteSpace: 'nowrap' as const
}

const bodyCellStyle = {
  padding: '0.75rem 1rem',
  borderBottom: '1px solid #f0f0f0',
  verticalAlign: 'top' as const
}

export function PropsTable({ component, data }: Props) {
  const spec = component ? getComponentSpec(component) : null
  const rows: Prop[] = spec ? spec.propsTable : (data ?? [])

  return (
    <Box overflow="auto" my="600">
      <Box as="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
        <Box as="thead">
          <Box as="tr">
            <Box as="th" style={headerCellStyle}>
              <Text as="span" textStyle="bodySmallStrong" color="textDefaultDefault">
                Prop
              </Text>
            </Box>
            <Box as="th" style={headerCellStyle}>
              <Text as="span" textStyle="bodySmallStrong" color="textDefaultDefault">
                Type
              </Text>
            </Box>
            <Box as="th" style={headerCellStyle}>
              <Text as="span" textStyle="bodySmallStrong" color="textDefaultDefault">
                Default
              </Text>
            </Box>
            <Box as="th" style={headerCellStyle}>
              <Text as="span" textStyle="bodySmallStrong" color="textDefaultDefault">
                Required
              </Text>
            </Box>
            <Box as="th" style={headerCellStyle}>
              <Text as="span" textStyle="bodySmallStrong" color="textDefaultDefault">
                Description
              </Text>
            </Box>
          </Box>
        </Box>

        <Box as="tbody">
          {rows.map((p) => (
            <Box as="tr" key={p.name}>
              <Box as="td" style={bodyCellStyle}>
                <Box
                  as="code"
                  px="100"
                  py="50"
                  rounded="100"
                  bg="backgroundDefaultTertiary"
                  style={{
                    fontSize: '0.8125rem',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    color: '#d63384'
                  }}
                >
                  {p.name}
                </Box>
              </Box>
              <Box as="td" style={bodyCellStyle}>
                <Box
                  as="code"
                  px="100"
                  py="50"
                  rounded="100"
                  bg="backgroundDefaultTertiary"
                  style={{
                    fontSize: '0.8125rem',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    color: '#d63384'
                  }}
                >
                  {p.type}
                </Box>
              </Box>
              <Box as="td" style={bodyCellStyle}>
                <Text as="span" textStyle="bodySmall" color="textDefaultSecondary">
                  {p.default ?? '-'}
                </Text>
              </Box>
              <Box as="td" style={bodyCellStyle}>
                <Text as="span" textStyle="bodySmall" color="textDefaultSecondary">
                  {p.required ? 'Yes' : 'No'}
                </Text>
              </Box>
              <Box as="td" style={bodyCellStyle}>
                <Text as="span" textStyle="bodySmall" color="textDefaultSecondary">
                  {p.description}
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
