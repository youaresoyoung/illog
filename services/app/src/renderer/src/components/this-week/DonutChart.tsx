import { useMemo } from 'react'
import type { ChartSegment } from '../../utils/category-analytics'
import { DONUT_BACKGROUND_COLORS, DONUT_BORDER_COLORS } from '../../constant/color'

// TODO: 이후 주석에 대해 영어로 변경 필요

const INNER_RATIO = 0.55
const STROKE_WIDTH = 0.75

type Props = {
  segments: ChartSegment[]
  size?: number
}

function toRadians(degrees: number) {
  // -90도: 12시 방향(위)부터 시작하도록 조정
  return ((degrees - 90) * Math.PI) / 180
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
  outerR: number,
  innerR: number,
  startDeg: number,
  endDeg: number
): string {
  const cos = Math.cos
  const sin = Math.sin
  const s = toRadians(endDeg)
  const e = toRadians(startDeg)
  const large = endDeg - startDeg > 180 ? 1 : 0

  return [
    `M ${cx + outerR * cos(s)} ${cy + outerR * sin(s)}`, // 시작점: 외부 원의 endDeg 위치
    `A ${outerR} ${outerR} 0 ${large} 0 ${cx + outerR * cos(e)} ${cy + outerR * sin(e)}`, // 외부 호를 그림 (endDeg -> startDeg)
    `L ${cx + innerR * cos(e)} ${cy + innerR * sin(e)}`, // 안쪽 원으로 직선 연결
    `A ${innerR} ${innerR} 0 ${large} 1 ${cx + innerR * cos(s)} ${cy + innerR * sin(s)}`, // 내부 호를 그림 (startDeg -> endDeg)
    'Z' // 경로 닫기
  ].join(' ')
}

export const DonutChart = ({ segments, size = 180 }: Props) => {
  const cx = size / 2 // // 중심 X, Y
  const outerR = size / 2 - STROKE_WIDTH / 2 // 테두리 잘림 방지
  const innerR = outerR * INNER_RATIO // 도넛 두께 (45%)

  const paths = useMemo(() => {
    if (segments.length === 0) {
      return [{ d: arcPath(cx, cx, outerR, innerR, 0, 359.99), fill: '#e5e7eb', stroke: '#d1d5db' }]
    }

    let angle = 0
    return segments
      .filter((seg) => seg.percentage > 0) // 0% 세그먼트 제거
      .map((seg) => {
        const sweep = Math.min((seg.percentage / 100) * 360, 359.99) // 100% → 359.99도 제한
        const d = arcPath(cx, cx, outerR, innerR, angle, angle + sweep)
        angle += sweep // 누적 각도

        return {
          d,
          fill: DONUT_BACKGROUND_COLORS[seg.color] ?? DONUT_BACKGROUND_COLORS.gray,
          stroke: DONUT_BORDER_COLORS[seg.color] ?? DONUT_BORDER_COLORS.gray
        }
      })
  }, [segments, cx, outerR, innerR])

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.fill} stroke={p.stroke} strokeWidth={STROKE_WIDTH} />
      ))}
    </svg>
  )
}
