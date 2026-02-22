import type { HorizontalBarProps } from './types'

const DEFAULT_MIN = 0
const DEFAULT_MAX = 100
const DEFAULT_HEIGHT = 8
const DEFAULT_RADIUS = 999
const DEFAULT_TRACK_COLOR = 'var(--background-default-tertiary)'
const DEFAULT_FILL_COLOR = 'var(--background-brand-default)'

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export const HorizontalBar = ({
  value,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  height = DEFAULT_HEIGHT,
  radius = DEFAULT_RADIUS,
  fillColor = DEFAULT_FILL_COLOR,
  trackColor = DEFAULT_TRACK_COLOR,
  isAnimated = true,
  trackStyle,
  fillStyle,
  ariaLabel,
  className,
  style,
  ...restProps
}: HorizontalBarProps) => {
  const safeMin = Number.isFinite(min) ? min : DEFAULT_MIN
  const safeMax = Number.isFinite(max) && max > safeMin ? max : DEFAULT_MAX
  const safeValue = clamp(Number.isFinite(value) ? value : safeMin, safeMin, safeMax)

  const range = safeMax - safeMin
  const ratio = range > 0 ? (safeValue - safeMin) / range : 0

  return (
    <div
      {...restProps}
      className={className}
      style={{ width: '100%', ...style }}
      role="progressbar"
      aria-label={ariaLabel ?? 'Progress'}
      aria-valuemin={safeMin}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
    >
      <div
        data-slot="track"
        style={{
          width: '100%',
          height,
          borderRadius: radius,
          backgroundColor: trackColor,
          overflow: 'hidden',
          ...trackStyle
        }}
      >
        <div
          data-slot="fill"
          style={{
            width: `${ratio * 100}%`,
            height: '100%',
            borderRadius: radius,
            backgroundColor: fillColor,
            transition: isAnimated ? 'width 160ms ease-out' : undefined,
            ...fillStyle
          }}
        />
      </div>
    </div>
  )
}
