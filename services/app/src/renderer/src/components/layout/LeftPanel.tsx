import { Navigation, Text, useNavContext } from '@illog/ui'

export const LeftPanel = () => {
  const { activeId, list, updateActiveId } = useNavContext()

  const handleItemClick = (id: string) => {
    updateActiveId(id)
  }

  return (
    <Navigation.Container>
      <Text as="h1" textStyle="heading">
        illog
      </Text>
      <Navigation.List mt="1200">
        {list.map((page) => (
          <Navigation.Item
            key={page.id}
            id={page.id}
            to={page.to}
            iconName={page.iconName}
            label={page.label}
            onClick={() => handleItemClick(page.id)}
            isActive={activeId === page.id}
          />
        ))}
      </Navigation.List>
    </Navigation.Container>
  )
}
