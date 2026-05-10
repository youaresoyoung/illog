import { useEffect, useLayoutEffect, useRef, useState, MouseEvent } from 'react'
import { Portal } from '../Portal'
import { OverlayProps } from './types'
import * as styles from './Overlay.css'
import clsx from 'clsx'

export const Overlay = ({
  isOpen,
  onClose,
  children,
  backgroundOpacity = 50,
  disableBackdropClick = false,
  disableEscapeKey = false,
  zIndex = 1000,
  backdropClassName,
  contentClassName,
  animationDuration = 200,
  animation = 'fade',
  ariaLabel,
  container
}: OverlayProps) => {
  const [isExiting, setIsExiting] = useState(false)
  const [shouldRender, setShouldRender] = useState(isOpen)
  const backdropRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (isOpen) {
      // NOTE: Since useLayoutEffect runs synchronously before DOM updates, calling setState is safe
      // eslint-disable-next-line
      setIsExiting(false)
      setShouldRender(true)
    } else if (shouldRender) {
      setIsExiting(true)
      const timer = setTimeout(() => {
        setShouldRender(false)
        setIsExiting(false)
      }, animationDuration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, shouldRender, animationDuration])

  useEffect(() => {
    if (!shouldRender || disableEscapeKey || !onClose) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shouldRender, disableEscapeKey, onClose])

  useEffect(() => {
    if (!shouldRender) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [shouldRender])

  useEffect(() => {
    if (!shouldRender || !contentRef.current) return

    const focusableElements = contentRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    if (firstElement) {
      firstElement.focus()
    }
  }, [shouldRender])

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (disableBackdropClick || !onClose) return

    if (event.target === backdropRef.current) {
      onClose()
    }
  }

  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  if (!shouldRender) return null

  const backdropOpacity = Math.max(0, Math.min(100, backgroundOpacity)) / 100

  const backdropAlignClass =
    animation === 'slideLeft'
      ? styles.contentAlignLeft
      : animation === 'slideRight'
        ? styles.contentAlignRight
        : undefined

  return (
    <Portal container={container}>
      <div
        ref={backdropRef}
        className={clsx([
          styles.backdrop,
          isExiting && styles.backdropExit,
          backdropAlignClass,
          backdropClassName
        ])}
        style={{
          backgroundColor: `rgba(0, 0, 0, ${backdropOpacity})`,
          zIndex,
          animationDuration: `${animationDuration}ms`
        }}
        onClick={handleBackdropClick}
        role="presentation"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        <div
          ref={contentRef}
          className={clsx([
            styles.contentBase,
            isExiting ? styles.contentAnimationExit[animation] : styles.contentAnimation[animation],
            contentClassName
          ])}
          onClick={handleContentClick}
          role="dialog"
          tabIndex={-1}
          style={{
            animationDuration: `${animationDuration}ms`
          }}
        >
          {children}
        </div>
      </div>
    </Portal>
  )
}
