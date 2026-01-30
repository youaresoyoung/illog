import { useState, useCallback, useMemo } from 'react'
import {
  INITIAL_FILTER,
  isLeafLevel,
  ETC_SEGMENT_ID,
  ETC_FILTER_ID,
  type AnalyticsFilter,
  type ViewMode,
  type ChartSegment
} from '../utils/category-analytics'

export function useAnalyticsFilter() {
  const [filter, setFilter] = useState<AnalyticsFilter>(INITIAL_FILTER)

  const setViewMode = useCallback((viewMode: ViewMode) => {
    setFilter({ viewMode, selectedCategory: null, selectedSubcategory: null })
  }, [])

  const selectDrill1 = useCallback((id: string | '__etc__', name: string) => {
    setFilter((prev) => ({ ...prev, selectedCategory: { id, name }, selectedSubcategory: null }))
  }, [])

  const selectDrill2 = useCallback((id: string | '__etc__', name: string) => {
    setFilter((prev) => ({ ...prev, selectedSubcategory: { id, name } }))
  }, [])

  const goBackToDrill1 = useCallback(() => {
    setFilter((prev) => ({ ...prev, selectedSubcategory: null }))
  }, [])

  const resetDrill = useCallback(() => {
    setFilter((prev) => ({ ...prev, selectedCategory: null, selectedSubcategory: null }))
  }, [])

  const isLeaf = useMemo(() => isLeafLevel(filter), [filter])

  const handleSegmentClick = useCallback(
    (segment: ChartSegment) => {
      if (isLeafLevel(filter)) return
      const id = segment.id === ETC_SEGMENT_ID ? ETC_FILTER_ID : segment.id
      if (!filter.selectedCategory) {
        selectDrill1(id, segment.name)
      } else {
        selectDrill2(id, segment.name)
      }
    },
    [filter, selectDrill1, selectDrill2]
  )

  return {
    filter,
    isLeaf,
    setViewMode,
    selectDrill1,
    selectDrill2,
    goBackToDrill1,
    resetDrill,
    handleSegmentClick
  }
}
