import { useState } from 'react'
import { Overlay, Button, Stack, Text, Input } from '@illog/ui'

export default {
  title: 'UI/Overlay',
  component: Overlay
}

export const BasicUsage = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Open Overlay
      </Button>

      <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Stack
          backgroundColor="backgroundDefaultDefault"
          p="600"
          borderRadius="400"
          gap="400"
          style={{ minWidth: '400px' }}
        >
          <Text textStyle="heading">Hello Overlay!</Text>
          <Text textStyle="bodyBase">Click the backdrop to close, or press ESC</Text>
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </Stack>
      </Overlay>
    </>
  )
}

export const ConfirmationDialog = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleConfirm = () => {
    alert('Confirmed!')
    setIsOpen(false)
  }

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Delete Item
      </Button>

      <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Stack
          backgroundColor="backgroundDefaultDefault"
          p="600"
          borderRadius="400"
          gap="400"
          style={{ minWidth: '360px' }}
        >
          <Text textStyle="subheading">Delete Item?</Text>
          <Text textStyle="bodyBase" color="textDefaultSecondary">
            This action cannot be undone. Are you sure you want to proceed?
          </Text>
          <Stack gap="300">
            <Button variant="primary" onClick={handleConfirm}>
              Confirm Delete
            </Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Overlay>
    </>
  )
}

export const CustomOpacity = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [opacity, setOpacity] = useState(50)

  return (
    <>
      <Stack gap="400" style={{ maxWidth: '400px' }}>
        <Text textStyle="bodyBase">Backdrop Opacity: {opacity}%</Text>
        <input
          type="range"
          min="0"
          max="100"
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          Open Overlay
        </Button>
      </Stack>

      <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)} backgroundOpacity={opacity}>
        <Stack
          backgroundColor="backgroundDefaultDefault"
          p="600"
          borderRadius="400"
          gap="400"
          style={{ minWidth: '400px' }}
        >
          <Text textStyle="subheading">Custom Opacity</Text>
          <Text textStyle="bodyBase">Current backdrop opacity: {opacity}%</Text>
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </Stack>
      </Overlay>
    </>
  )
}

export const DisableBackdropClick = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Open Overlay
      </Button>

      <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)} disableBackdropClick={true}>
        <Stack
          backgroundColor="backgroundDefaultDefault"
          p="600"
          borderRadius="400"
          gap="400"
          style={{ minWidth: '400px' }}
        >
          <Text textStyle="subheading">Backdrop Click Disabled</Text>
          <Text textStyle="bodyBase">
            You cannot close this by clicking the backdrop. Use the button or ESC key.
          </Text>
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </Stack>
      </Overlay>
    </>
  )
}

export const FormExample = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')

  const handleSubmit = () => {
    alert(`Submitted: ${name}`)
    setIsOpen(false)
    setName('')
  }

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Add New Item
      </Button>

      <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Stack
          backgroundColor="backgroundDefaultDefault"
          p="600"
          borderRadius="400"
          gap="600"
          style={{ minWidth: '480px' }}
        >
          <Text textStyle="heading">Add New Item</Text>

          <Stack gap="300">
            <Text textStyle="bodyStrong">Name</Text>
            <Input
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Stack>

          <Stack gap="300">
            <Text textStyle="bodyStrong">Description</Text>
            <Input placeholder="Enter description" />
          </Stack>

          <Stack gap="300">
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Overlay>
    </>
  )
}

export const NestedContent = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Open Overlay
      </Button>

      <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Stack
          backgroundColor="backgroundDefaultDefault"
          p="600"
          borderRadius="400"
          gap="400"
          style={{ maxWidth: '600px' }}
        >
          <Text textStyle="heading">Content Preview</Text>

          <Stack
            gap="300"
            p="400"
            backgroundColor="backgroundDefaultSecondary"
            borderRadius="200"
            style={{ maxHeight: '400px', overflow: 'auto' }}
          >
            <Text textStyle="bodyBase">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </Text>
            <Text textStyle="bodyBase">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </Text>
            <Text textStyle="bodyBase">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur.
            </Text>
          </Stack>

          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </Stack>
      </Overlay>
    </>
  )
}

export const AnimationFade = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Fade Animation
      </Button>

      <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)} animation="fade">
        <Stack
          backgroundColor="backgroundDefaultDefault"
          p="600"
          borderRadius="400"
          gap="400"
          style={{ minWidth: '400px' }}
        >
          <Text textStyle="heading">Fade Animation</Text>
          <Text textStyle="bodyBase">This overlay fades in and out smoothly</Text>
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </Stack>
      </Overlay>
    </>
  )
}

export const AnimationSlideLeft = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Slide from Left
      </Button>

      <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)} animation="slideLeft">
        <Stack
          backgroundColor="backgroundDefaultDefault"
          p="600"
          gap="600"
          style={{
            width: '400px',
            height: '100vh',
            borderRadius: '0'
          }}
        >
          <Text textStyle="heading">Slide from Left</Text>
          <Text textStyle="bodyBase">This overlay slides in from the left side of the screen</Text>
          <Text textStyle="bodySmall" color="textDefaultSecondary">
            Perfect for side panels and navigation menus
          </Text>
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </Stack>
      </Overlay>
    </>
  )
}

export const AnimationSlideRight = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Slide from Right
      </Button>

      <Overlay isOpen={isOpen} onClose={() => setIsOpen(false)} animation="slideRight">
        <Stack
          backgroundColor="backgroundDefaultDefault"
          p="600"
          gap="600"
          style={{
            width: '400px',
            height: '100vh',
            borderRadius: '0'
          }}
        >
          <Text textStyle="heading">Slide from Right</Text>
          <Text textStyle="bodyBase">This overlay slides in from the right side of the screen</Text>
          <Text textStyle="bodySmall" color="textDefaultSecondary">
            Ideal for settings panels and detail views
          </Text>
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </Stack>
      </Overlay>
    </>
  )
}
