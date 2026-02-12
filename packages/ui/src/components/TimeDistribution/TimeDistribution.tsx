import { Fragment, useMemo } from 'react'
import { Box } from '../Box'
import { DonutChart } from '../DonutChart'
import { Inline } from '../Inline'
import { Stack } from '../Stack'
import { Text } from '../Typography'
import type { TimeDistributionProps, TimeDistributionRenderItemParams } from './types'

type NormalizedEntry<T> = {
  item: T
  index: number
  key: string
  value: number
  percentage: number
  fillColor: string
  strokeColor?: string
}

const DEFAULT_EMPTY_MESSAGE = 'No data available'
const DEFAULT_CHART_SIZE = 180
const DEFAULT_LEGEND_MAX_WIDTH = 240
const DEFAULT_LEGEND_DOT_SIZE = 12

function normalizeValue(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 0
  }
  return value
}

function renderTitle(title: TimeDistributionProps<unknown>['title']) {
  if (title === undefined || title === null) {
    return null
  }

  if (typeof title === 'string' || typeof title === 'number') {
    return (
      <Text textStyle="bodyStrong" color="textDefaultDefault">
        {title}
      </Text>
    )
  }

  return title
}

export const TimeDistribution = <T,>({
  title,
  items,
  getValue,
  getFillColor,
  getStrokeColor,
  getLabel,
  getKey,
  onItemClick,
  isItemClickable,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  chartSize = DEFAULT_CHART_SIZE,
  chartProps,
  legendMaxWidth = DEFAULT_LEGEND_MAX_WIDTH,
  legendDotSize = DEFAULT_LEGEND_DOT_SIZE,
  renderLegendItem,
  className
}: TimeDistributionProps<T>) => {
  const normalizedEntries = useMemo(() => {
    const entries = items.map((item, index) => ({
      item,
      index,
      key: getKey ? getKey(item, index) : String(index),
      value: normalizeValue(getValue(item)),
      fillColor: getFillColor(item),
      strokeColor: getStrokeColor?.(item)
    }))

    const totalValue = entries.reduce((sum, entry) => sum + entry.value, 0)

    return entries.map(
      (entry): NormalizedEntry<T> => ({
        ...entry,
        percentage: totalValue > 0 ? (entry.value / totalValue) * 100 : 0
      })
    )
  }, [items, getKey, getValue, getFillColor, getStrokeColor])

  const chartEntries = useMemo(
    () => normalizedEntries.filter((entry) => entry.value > 0),
    [normalizedEntries]
  )

  if (items.length === 0) {
    return (
      <Stack gap="400" className={className}>
        {renderTitle(title)}
        <Text textStyle="bodyBase" color="textDefaultTertiary">
          {emptyMessage}
        </Text>
      </Stack>
    )
  }

  return (
    <Stack gap="400" className={className}>
      {renderTitle(title)}

      <Stack gap="600" align="center" bg="backgroundDefaultDefault" rounded="200" px="400" py="800">
        <DonutChart
          {...chartProps}
          size={chartSize}
          segments={chartEntries.map((entry) => ({
            id: entry.key,
            value: entry.value,
            fill: entry.fillColor,
            stroke: entry.strokeColor
          }))}
          onSegmentClick={
            onItemClick
              ? (_, chartIndex) => {
                  const entry = chartEntries[chartIndex]
                  if (!entry) {
                    return
                  }
                  onItemClick(entry.item, entry.index)
                }
              : undefined
          }
        />

        <Inline gap="200" wrap="wrap" justify="center">
          {normalizedEntries.map((entry) => {
            const isClickable =
              Boolean(onItemClick) &&
              (isItemClickable ? isItemClickable(entry.item, entry.index) : true)

            const clickHandler = isClickable
              ? () => {
                  onItemClick?.(entry.item, entry.index)
                }
              : undefined

            const renderParams: TimeDistributionRenderItemParams<T> = {
              item: entry.item,
              index: entry.index,
              value: entry.value,
              percentage: entry.percentage,
              isClickable,
              onClick: clickHandler
            }

            if (renderLegendItem) {
              return <Fragment key={entry.key}>{renderLegendItem(renderParams)}</Fragment>
            }

            const label = getLabel(entry.item, {
              index: entry.index,
              value: entry.value,
              percentage: entry.percentage
            })

            if (isClickable) {
              return (
                <Inline
                  as="button"
                  key={entry.key}
                  type="button"
                  maxWidth={legendMaxWidth}
                  gap="200"
                  align="center"
                  overflow="hidden"
                  onClick={clickHandler}
                  style={{
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    padding: 0
                  }}
                >
                  <Box
                    flexShrink={0}
                    rounded="full"
                    style={{
                      width: legendDotSize,
                      height: legendDotSize,
                      backgroundColor: entry.fillColor,
                      border: `1px solid ${entry.strokeColor ?? entry.fillColor}`
                    }}
                  />
                  <Text textStyle="caption" color="textDefaultSecondary" truncate="true">
                    {label}
                  </Text>
                </Inline>
              )
            }

            return (
              <Inline
                key={entry.key}
                maxWidth={legendMaxWidth}
                gap="200"
                align="center"
                overflow="hidden"
              >
                <Box
                  flexShrink={0}
                  rounded="full"
                  style={{
                    width: legendDotSize,
                    height: legendDotSize,
                    backgroundColor: entry.fillColor,
                    border: `1px solid ${entry.strokeColor ?? entry.fillColor}`
                  }}
                />
                <Text textStyle="caption" color="textDefaultSecondary" truncate="true">
                  {label}
                </Text>
              </Inline>
            )
          })}
        </Inline>
      </Stack>
    </Stack>
  )
}
