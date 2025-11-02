import { useCallback, useState } from 'react'

type Props = {
  initialOpen?: boolean
  onOpen?: () => void
  onClose?: () => void
}

type ReturnType = [boolean, () => void, () => void]

export const useDialog = ({ initialOpen = false, onOpen, onClose }: Props): ReturnType => {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = useCallback(() => {
    setIsOpen(true)
    onOpen?.()
  }, [onOpen])

  const close = useCallback(() => {
    setIsOpen(false)
    onClose?.()
  }, [onClose])

  return [isOpen, open, close]
}
