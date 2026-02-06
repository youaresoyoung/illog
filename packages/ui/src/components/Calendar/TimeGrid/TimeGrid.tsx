import { useEffect, useRef } from 'react'
import { TimeGridProps } from '../types'
import { formatTimeLabel, getMinutesFromMidnight } from '../utils'
import { useCurrentTime } from '../hooks'
import { Box } from '../../Box'
import {
  DEFAULT_GUTTER_WIDTH,
  DEFAULT_HOUR_HEIGHT,
  DEFAULT_SCROLL_HEIGHT,
  HOURS
} from '../constants'

import { HourRow } from './HourRow'
import { CurrentTimeIndicator } from './CurrentTimeIndicator'

export const TimeGrid = ({
  columns = 1,
  hourHeight = DEFAULT_HOUR_HEIGHT,
  gutterWidth = DEFAULT_GUTTER_WIDTH,
  scrollHeight = DEFAULT_SCROLL_HEIGHT,
  showCurrentTime = true,
  currentTimeColumn = -1,
  header,
  children,
  style
}: TimeGridProps) => {
  const totalHeight = 24 * hourHeight
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasScrolled = useRef(false)
  const now = useCurrentTime()
  const nowMinutes = getMinutesFromMidnight(now)
  const nowTop = (nowMinutes / 60) * hourHeight

  // NOTE: Auto-scroll to current time on initial load (only if current time is within the visible range)
  useEffect(() => {
    if (scrollRef.current && !hasScrolled.current) {
      const scrollTarget = Math.max(0, nowTop - 120)
      scrollRef.current.scrollTo({ top: scrollTarget, behavior: 'smooth' })
      hasScrolled.current = true
    }
  }, [nowTop])

  return (
    <Box
      rounded="200"
      borderWidth="border"
      borderColor="borderDefaultDefault"
      borderStyle="solid"
      backgroundColor="backgroundDefaultDefault"
      overflow="hidden"
      style={style}
    >
      {header}

      <Box
        ref={scrollRef}
        position="relative"
        height={scrollHeight}
        overflowY="auto"
        overflowX="hidden"
      >
        <Box position="relative" height={totalHeight}>
          {HOURS.map((hour) => (
            <HourRow
              key={hour}
              hour={hour}
              hourHeight={hourHeight}
              gutterWidth={gutterWidth}
              columns={columns}
            />
          ))}

          {showCurrentTime && (
            <CurrentTimeIndicator
              nowMinutes={nowMinutes}
              hourHeight={hourHeight}
              gutterWidth={gutterWidth}
              columns={columns}
              currentTimeColumn={currentTimeColumn}
              timeLabel={formatTimeLabel(now)}
            />
          )}

          {children}
        </Box>
      </Box>
    </Box>
  )
}
