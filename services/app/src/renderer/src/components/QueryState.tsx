import { Stack, Text, Button } from '@illog/ui'
import { getUserMessage } from '../../../shared/errors'

export function QueryErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <Stack align="center" gap="400" py="800">
      <Text textStyle="bodyBase" color="textDefaultTertiary">
        {getUserMessage(error)}
      </Text>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Stack>
  )
}
