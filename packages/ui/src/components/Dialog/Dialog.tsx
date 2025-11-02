import { useEffect, useRef } from 'react'
import { Portal } from '../Portal'
import { DialogProps } from './types'
import { DialogTitle } from './DialogTitle'
import { extractSprinkleProps } from '../../utils/util'
import clsx from 'clsx'
import { sprinkles } from '../../core/sprinkles.css'
import { Center } from '../Center'
import { DialogContent } from './DialogContent'
import { DialogDescription } from './DialogDescription'
import { DialogFooter } from './DialogFooter'

export const DialogRoot = ({
  isOpen,
  children,
  className,
  role = 'dialog',
  ariaLabel,
  ariaDescribedby,
  ...props
}: DialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const [sprinkleProps, restProps] = extractSprinkleProps(props)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <Portal>
      <Center
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        p="400"
        rounded="200"
        width="360px"
        maxHeight="480px"
        flexDirection="column"
        gap="400"
        ref={dialogRef}
        as="dialog"
        role={role}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedby}
        className={clsx([sprinkles(sprinkleProps), className])}
        {...restProps}
      >
        {children}
      </Center>
    </Portal>
  )
}

export const Dialog = Object.assign(DialogRoot, {
  Title: DialogTitle,
  Content: DialogContent,
  Description: DialogDescription,
  Footer: DialogFooter
} as const)
