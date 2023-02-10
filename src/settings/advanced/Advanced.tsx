import {
  Accordion,
  Button,
  Flex,
  Modal,
  NumberInput,
  Stack,
  TextInput,
} from '@mantine/core'
import {
  IconAlertTriangle,
  IconArrowBackUp,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import { useState } from 'react'
import { useBoundStore } from '../../store'

export default function Advanced() {
  const resetSkipNumbers = useBoundStore((s) => s.resetSkipNumbers)
  const resetCustomTags = useBoundStore((s) => s.resetCustomTags)
  const resetThrowDistance = useBoundStore((s) => s.resetThrowDistance)

  const overpassEndpoint = useBoundStore((s) => s.overpassEndpoint)
  const updateOverpassEndpoint = useBoundStore((s) => s.updateOverpassEndpoint)
  const resetOverpassEndpoint = useBoundStore((s) => s.resetOverpassEndpoint)

  const overpassTimeout = useBoundStore((s) => s.overpassTimeout)
  const updateOverpassTimeout = useBoundStore((s) => s.updateOverpassTimeout)
  const resetOverpassTimeout = useBoundStore((s) => s.resetOverpassTimeout)

  const resetStreetSearchDistance = useBoundStore(
    (s) => s.resetStreetSearchDistance,
  )

  const reset = () => {
    setResetModalOpened(false)
    resetOverpassTimeout()
    resetOverpassEndpoint()
    resetStreetSearchDistance()
    resetThrowDistance()
    resetCustomTags()
    resetSkipNumbers()
  }

  const isValidUrl = (string: string) => {
    let url
    try {
      url = new URL(string)
    } catch (e) {
      return false
    }
    return ['http:', 'https:'].includes(url.protocol)
  }

  const [resetModalOpened, setResetModalOpened] = useState(false)

  return (
    <>
      <Modal
        size="auto"
        title="Are you sure you want to reset all settings?"
        opened={resetModalOpened}
        onClose={() => setResetModalOpened(false)}
        centered
      >
        <Flex justify="space-between">
          <Button
            variant="outline"
            leftIcon={<IconX />}
            onClick={() => setResetModalOpened(false)}
          >
            No
          </Button>
          <Button color="red" leftIcon={<IconTrash />} onClick={reset}>
            Yes
          </Button>
        </Flex>
      </Modal>
      <Accordion.Item value="advanced">
        <Accordion.Control icon={<IconAlertTriangle />}>
          Advanced
        </Accordion.Control>
        <Accordion.Panel>
          <Stack>
            <NumberInput
              label="Overpass timeout (milliseconds)"
              value={overpassTimeout}
              onChange={updateOverpassTimeout}
              min={0}
              max={10000}
            />
            <TextInput
              label="Overpass endpoint"
              value={overpassEndpoint}
              onChange={(e) => updateOverpassEndpoint(e.target.value)}
              error={isValidUrl(overpassEndpoint) ? '' : 'URL is invalid'}
              type="url"
            />
            <Button
              color="red"
              leftIcon={<IconArrowBackUp />}
              onClick={() => setResetModalOpened(true)}
            >
              Reset all settings
            </Button>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </>
  )
}
