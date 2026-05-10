import { useMemo } from 'react'
import type { DonutChartProps, DonutChartSegment } from './types'

const DEFAULT_SIZE = 180
const DEFAULT_INNER_RATIO = 0.55
const DEFAULT_STROKE_WIDTH = 0.75
const DEFAULT_EMPTY_FILL = 'var(--background-default-tertiary)'
const DEFAULT_EMPTY_STROKE = 'var(--border-default-default)'
const FULL_ARC_DEGREES = 359.99

function toRadians(degrees: number): number {
  // Start from 12 o'clock instead of 3 o'clock.
  return ((degrees - 90) * Math.PI) / 180
}

function clampInnerRatio(innerRatio: number): number {
  return Math.min(Math.max(innerRatio, 0), 0.95)
}

function normalizeValue(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 0
  }
  return value
}

/**
 *
 *        0° (12시)
 *          │
 *          │
 * 270° ────┼──── 90°
 *          │
 *          │
 *         180°
 * Segment 1: 0° → 108° (30%)
 * Segment 2: 108° → 360° (70%)
 */

function arcPath(
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  startDeg: number,
  endDeg: number
): string {
  const start = toRadians(startDeg)
  const end = toRadians(endDeg)
  const largeArcFlag = endDeg - startDeg > 180 ? 1 : 0

  const outerStartX = cx + outerRadius * Math.cos(start)
  const outerStartY = cy + outerRadius * Math.sin(start)
  const outerEndX = cx + outerRadius * Math.cos(end)
  const outerEndY = cy + outerRadius * Math.sin(end)

  const innerEndX = cx + innerRadius * Math.cos(end)
  const innerEndY = cy + innerRadius * Math.sin(end)
  const innerStartX = cx + innerRadius * Math.cos(start)
  const innerStartY = cy + innerRadius * Math.sin(start)

  return [
    `M ${outerStartX} ${outerStartY}`, // 시작점: 외부 원의 endDeg 위치
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`, // 외부 원 호 (endDeg 방향으로 시계방향)
    `L ${innerEndX} ${innerEndY}`, // 선분: 외부 원의 endDeg 위치에서 내부 원의 endDeg 위치로
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`, // 내부 원 호 (startDeg 방향으로 반시계방향)
    'Z' // 선분: 내부 원의 startDeg 위치에서 외부 원의 startDeg 위치로 (도형 닫기)
  ].join(' ')
}

export const DonutChart = ({
  segments,
  size = DEFAULT_SIZE,
  innerRatio = DEFAULT_INNER_RATIO,
  startAngle = 0,
  defaultStrokeWidth = DEFAULT_STROKE_WIDTH,
  emptyFill = DEFAULT_EMPTY_FILL,
  emptyStroke = DEFAULT_EMPTY_STROKE,
  onSegmentClick,
  segmentKey,
  className,
  ...restProps
}: DonutChartProps) => {
  const normalizedSegments = useMemo(
    () =>
      segments
        .map((segment, index) => ({
          segment,
          index,
          value: normalizeValue(segment.value)
        }))
        .filter(({ value }) => value > 0),
    [segments]
  )

  const totalValue = useMemo(
    () => normalizedSegments.reduce((sum, current) => sum + current.value, 0),
    [normalizedSegments]
  )

  const maxStrokeWidth = useMemo(() => {
    const widths = normalizedSegments.map(
      ({ segment }) => segment.strokeWidth ?? defaultStrokeWidth
    )
    return widths.length > 0 ? Math.max(...widths) : defaultStrokeWidth
  }, [normalizedSegments, defaultStrokeWidth])

  const center = size / 2 // 최대 테두리 폭을 고려하여 중심점 계산 (테두리가 반으로 겹치므로)
  const outerRadius = center - maxStrokeWidth / 2 // 최대 테두리 폭을 고려하여 외부 반지름 계산
  const innerRadius = outerRadius * clampInnerRatio(innerRatio) // 도넛 두께

  const resolvedPaths = useMemo(() => {
    if (normalizedSegments.length === 0 || totalValue <= 0) {
      return [
        {
          key: 'empty',
          d: arcPath(
            center,
            center,
            outerRadius,
            innerRadius,
            startAngle,
            startAngle + FULL_ARC_DEGREES
          ),
          fill: emptyFill,
          stroke: emptyStroke,
          strokeWidth: defaultStrokeWidth,
          segment: null as DonutChartSegment | null,
          index: -1
        }
      ]
    }

    let currentAngle = startAngle

    return normalizedSegments.map(({ segment, value }, index) => {
      const remainingSweep = FULL_ARC_DEGREES - (currentAngle - startAngle)
      const rawSweep = (value / totalValue) * 360
      const sweep =
        index === normalizedSegments.length - 1
          ? remainingSweep
          : Math.min(rawSweep, remainingSweep)
      const nextAngle = currentAngle + Math.max(sweep, 0)

      const path = {
        key: segmentKey ? segmentKey(segment, index) : (segment.id ?? `segment-${index}`),
        d: arcPath(center, center, outerRadius, innerRadius, currentAngle, nextAngle),
        fill: segment.fill,
        stroke: segment.stroke,
        strokeWidth: segment.strokeWidth ?? defaultStrokeWidth,
        segment,
        index
      }

      currentAngle = nextAngle
      return path
    })
  }, [
    center,
    defaultStrokeWidth,
    emptyFill,
    emptyStroke,
    innerRadius,
    normalizedSegments,
    outerRadius,
    segmentKey,
    startAngle,
    totalValue
  ])

  return (
    <svg
      {...restProps}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role={restProps.role ?? 'img'}
      aria-label={restProps['aria-label'] ?? 'Donut chart'}
    >
      {resolvedPaths.map((path) => (
        <path
          key={path.key}
          d={path.d}
          fill={path.fill}
          stroke={path.stroke}
          strokeWidth={path.strokeWidth}
          style={{ cursor: onSegmentClick && path.segment ? 'pointer' : 'default' }}
          onClick={path.segment ? () => onSegmentClick?.(path.segment!, path.index) : undefined}
          aria-label={path.segment?.ariaLabel}
        />
      ))}
    </svg>
  )
}
