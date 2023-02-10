import {
  Accordion,
  Autocomplete,
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
} from '@mantine/core'
import {
  IconAlertTriangle,
  IconArrowBackUp,
  IconTrash,
  IconX,
} from '@tabler/icons-react'
import { useState } from 'react'
import { useBoundStore } from '../../store'

const OVERPASS_ENDPOINT_OPTIONS = [
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
]

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
        opened={resetModalOpened}
        withCloseButton={false}
        onClose={() => setResetModalOpened(false)}
        centered
      >
        <Stack>
          <Text>Are you sure you want to reset all settings?</Text>
          <Group position="apart">
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
          </Group>
        </Stack>
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
              max={100_000}
            />
            <Autocomplete
              data={OVERPASS_ENDPOINT_OPTIONS}
              label="Overpass endpoint"
              value={overpassEndpoint}
              onChange={(e) => updateOverpassEndpoint(e)}
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
