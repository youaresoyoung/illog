import { Inline, Text, Icon } from '@illog/ui'
import type { AnalyticsFilter } from '../../utils/category-analytics'
import { getBreadcrumbRoot } from '../../utils/category-analytics'

type Props = {
  filter: AnalyticsFilter
  onResetDrill: () => void
  onGoBackToDrill1: () => void
}

export const AnalyticsFilterBar = ({ filter, onResetDrill, onGoBackToDrill1 }: Props) => {
  if (!filter.selectedCategory) return null

  const rootLabel = getBreadcrumbRoot(filter.viewMode)

  return (
    <Inline gap="200" align="center" py="200" overflow="hidden">
      <Text
        textStyle="bodyBase"
        color="textBrandDefault"
        style={{ cursor: 'pointer' }}
        onClick={onResetDrill}
      >
        {rootLabel}
      </Text>

      <Icon name="chevron_down" size="small" rotate={-90} />

      {filter.selectedSubcategory ? (
        <>
          <Text
            textStyle="bodyBase"
            color="textBrandDefault"
            style={{ cursor: 'pointer' }}
            onClick={onGoBackToDrill1}
          >
            {filter.selectedCategory.name}
          </Text>
          <Icon name="chevron_down" size="small" rotate={-90} />
          <Text textStyle="bodyStrong" color="textDefaultDefault" truncate="true">
            {filter.selectedSubcategory.name}
          </Text>
        </>
      ) : (
        <Text textStyle="bodyStrong" color="textDefaultDefault">
          {filter.selectedCategory.name}
        </Text>
      )}
    </Inline>
  )
}
