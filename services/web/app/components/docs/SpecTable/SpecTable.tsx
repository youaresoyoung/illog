// TODO: 스타일 관련 수정은 button 컴포넌트 테스트 이후에 진행

import { Box, Stack, Text } from '@/app/components/common/UI'
import { getComponentSpec } from '@/lib/spec'
import { SpecRow } from '@/lib/types'

type Props = {
  component: string
}

const headerCellStyle = {
  padding: '0.625rem 1rem',
  textAlign: 'left' as const,
  borderBottom: '2px solid #e5e5e5',
  whiteSpace: 'nowrap' as const
}

const bodyCellStyle = {
  padding: '0.5rem 1rem',
  borderBottom: '1px solid #f0f0f0',
  verticalAlign: 'middle' as const
}

const monoStyle = {
  fontSize: '0.8125rem',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
}

const groupBySelector = (rows: SpecRow[]) => {
  const groups = new Map<string, SpecRow[]>()
  for (const row of rows) {
    const existing = groups.get(row.selector)
    if (existing) existing.push(row)
    else groups.set(row.selector, [row])
  }
  return [...groups.entries()]
}

/**
 * 상태 / 슬롯 / 속성 / 값 4열 스펙 표.
 * 내용은 전부 packages/ui/spec/<id>.yaml 에서 생성되므로 문서에서 손볼 것이 없다.
 */
export function SpecTable({ component }: Props) {
  const spec = getComponentSpec(component)

  if (spec.specTable.length === 0) {
    return (
      <Text as="p" textStyle="bodySmall" color="textDefaultTertiary">
        아직 정의된 스펙이 없습니다.
      </Text>
    )
  }

  return (
    <Stack gap="800" my="600">
      {groupBySelector(spec.specTable).map(([selector, rows]) => (
        <Stack key={selector} gap="300">
          <Text as="h4" textStyle="bodyStrong" color="textDefaultDefault">
            {selector}
          </Text>

          <Box overflow="auto">
            <Box
              as="table"
              style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}
            >
              <Box as="thead">
                <Box as="tr">
                  {['상태', '요소', '속성', '값'].map((label) => (
                    <Box as="th" key={label} style={headerCellStyle}>
                      <Text as="span" textStyle="bodySmallStrong" color="textDefaultDefault">
                        {label}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box as="tbody">
                {rows.map((row) => (
                  <Box as="tr" key={`${row.state}-${row.element}-${row.property}`}>
                    <Box as="td" style={bodyCellStyle}>
                      <Text as="span" textStyle="bodySmall" color="textDefaultSecondary">
                        {row.state}
                      </Text>
                    </Box>
                    <Box as="td" style={bodyCellStyle}>
                      <Text as="span" textStyle="bodySmall" color="textDefaultSecondary">
                        {row.element}
                      </Text>
                    </Box>
                    <Box as="td" style={bodyCellStyle}>
                      <Box as="code" style={monoStyle}>
                        {row.property}
                      </Box>
                    </Box>
                    <Box as="td" style={bodyCellStyle}>
                      <ValueCell row={row} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Stack>
      ))}
    </Stack>
  )
}

function ValueCell({ row }: { row: SpecRow }) {
  // 토큰 밖 값은 숨기지 않고 이유와 함께 드러낸다.
  if (!row.token) {
    return (
      <Box as="span" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <Box as="code" style={monoStyle}>
          {row.value}
        </Box>
        <Text as="span" textStyle="caption" color="textDefaultTertiary">
          {`토큰 아님 — ${row.reason ?? ''}`}
        </Text>
      </Box>
    )
  }

  const isColor = row.token.startsWith('$color.')

  return (
    <Box as="span" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      {isColor && (
        <Box
          as="span"
          rounded="100"
          style={{
            width: '1rem',
            height: '1rem',
            flexShrink: 0,
            background: row.value,
            border: '1px solid rgba(0,0,0,0.1)'
          }}
        />
      )}
      <Box as="code" style={{ ...monoStyle, color: '#d63384' }}>
        {row.token}
      </Box>
    </Box>
  )
}
