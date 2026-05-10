import { Inline, Text, Icon } from '@illog/ui'
import type { AnalyticsFilter } from '../../utils/category-analytics'
import {
  getBreadcrumbRoot,
  getCategoryLabel,
  getSubcategoryLabel
} from '../../utils/category-analytics'

type Props = {
  filter: AnalyticsFilter
  onResetCategory: () => void
  onGoBackToCategory: () => void
}

export const AnalyticsFilterBar = ({ filter, onResetCategory, onGoBackToCategory }: Props) => {
  if (!filter.selectedCategory) return null

  const rootLabel = getBreadcrumbRoot(filter.viewMode)
  const categoryLabel = getCategoryLabel(filter)
  const subcategoryLabel = getSubcategoryLabel(filter)

  return (
    <Inline gap="200" align="center" py="200" overflow="hidden">
      <Text
        as="button"
        textStyle="bodyBase"
        color="textBrandDefault"
        whiteSpace="nowrap"
        flexShrink={0}
        onClick={onResetCategory}
      >
        {rootLabel}
      </Text>

      <Icon name="chevron_down" size="small" rotate={-90} />

      {filter.selectedSubcategory ? (
        <>
          <Text
            as="button"
            textStyle="bodyBase"
            color="textBrandDefault"
            whiteSpace="nowrap"
            flexShrink={0}
            maxWidth={'40%'}
            truncate="true"
            onClick={onGoBackToCategory}
          >
            {categoryLabel}: {filter.selectedCategory.name}
          </Text>
          <Icon name="chevron_down" size="small" rotate={-90} />
          <Text textStyle="bodyStrong" color="textDefaultDefault" truncate="true" maxWidth={'40%'}>
            {subcategoryLabel}: {filter.selectedSubcategory.name}
          </Text>
        </>
      ) : (
        <Text textStyle="bodyStrong" color="textDefaultDefault" truncate="true" maxWidth={'40%'}>
          {categoryLabel}: {filter.selectedCategory.name}
        </Text>
      )}
    </Inline>
  )
}
