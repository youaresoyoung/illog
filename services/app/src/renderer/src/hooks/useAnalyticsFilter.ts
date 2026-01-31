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

  const selectCategory = useCallback((id: string | '__etc__', name: string) => {
    setFilter((prev) => ({ ...prev, selectedCategory: { id, name }, selectedSubcategory: null }))
  }, [])

  const selectSubCategory = useCallback((id: string | '__etc__', name: string) => {
    setFilter((prev) => ({ ...prev, selectedSubcategory: { id, name } }))
  }, [])

  const goBackToCategory = useCallback(() => {
    setFilter((prev) => ({ ...prev, selectedSubcategory: null }))
  }, [])

  const resetCategory = useCallback(() => {
    setFilter((prev) => ({ ...prev, selectedCategory: null, selectedSubcategory: null }))
  }, [])

  const isLeaf = useMemo(() => isLeafLevel(filter), [filter])

  const handleSegmentClick = useCallback(
    (segment: ChartSegment) => {
      if (isLeafLevel(filter)) return
      const id = segment.id === ETC_SEGMENT_ID ? ETC_FILTER_ID : segment.id
      if (!filter.selectedCategory) {
        selectCategory(id, segment.name)
      } else {
        selectSubCategory(id, segment.name)
      }
    },
    [filter, selectCategory, selectSubCategory]
  )

  return {
    filter,
    isLeaf,
    setViewMode,
    selectCategory,
    selectSubCategory,
    goBackToCategory,
    resetCategory,
    handleSegmentClick
  }
}
