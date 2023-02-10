import { useState } from 'react'
import { useBoundStore } from '../../store'
import findNearestStreets from './find-nearest-streets'
import {
  Accordion,
  ActionIcon,
  Alert,
  Anchor,
  Autocomplete,
  Indicator,
  Input,
  Slider,
  Stack,
} from '@mantine/core'
import {
  IconAlertCircle,
  IconDownload,
  IconInfoCircle,
  IconRoad,
} from '@tabler/icons-react'

export default function Street() {
  const position = useBoundStore((s) => s.position)

  const street = useBoundStore((s) => s.street)
  const updateStreet = useBoundStore((s) => s.updateStreet)

  const streetSearchDistance = useBoundStore((s) => s.streetSearchDistance)
  const updateStreetSearchDistance = useBoundStore(
    (s) => s.updateStreetSearchDistance,
  )

  const streets = useBoundStore((s) => s.streets)
  const updateStreets = useBoundStore((s) => s.updateStreets)

  const [streetsStatus, setStreetsStatus] = useState<
    'none' | 'getting' | 'complete' | 'error'
  >('none')
  const [streetsError, setStreetsError] = useState<string | undefined>(
    undefined,
  )

  const overpassTimeout = useBoundStore((s) => s.overpassTimeout)
  const overpassEndpoint = useBoundStore((s) => s.overpassEndpoint)

  const getStreets = async () => {
    if (position === undefined) {
      // todo type check
      return
    }

    setStreetsStatus('getting')

    let newStreets: string[]

    try {
      newStreets = await findNearestStreets(
        position,
        streetSearchDistance,
        overpassEndpoint,
        Number(overpassTimeout), // todo nan
      )
    } catch (error) {
      if (error instanceof Error) {
        setStreetsError(error.message)
      } else {
        setStreetsError('Unknown error')
      }
      setStreetsStatus('error')
      return
    }

    setStreetsStatus('complete')
    updateStreets(newStreets)
  }

  return (
    <Accordion.Item value="street">
      <Accordion.Control icon={<IconRoad />}>Street</Accordion.Control>
      <Accordion.Panel>
        <Stack>
          <Autocomplete
            data={streets}
            placeholder="Street"
            rightSection={
              <Indicator
                label={streets.length}
                dot={false}
                showZero={false}
                overflowCount={10}
                position="top-start"
                size={14}
              >
                <ActionIcon
                  onClick={getStreets}
                  variant="outline"
                  loading={streetsStatus === 'getting'}
                >
                  <IconDownload size={20} />
                </ActionIcon>
              </Indicator>
            }
            autoCapitalize="words"
            autoComplete="off"
            value={street}
            onChange={updateStreet}
            description={
              <>
                Street data from{' '}
                <Anchor
                  href="https://openstreetmap.org/copyright"
                  target="_blank"
                  rel="noreferrer"
                >
                  OpenStreetMap
                </Anchor>
              </>
            }
          />
          {position === undefined && (
            <Alert icon={<IconInfoCircle />} color="orange">
              Loading streets requires an active GPS connection. Please start a
              survey to load streets.
            </Alert>
          )}
          {streetsStatus === 'error' && (
            <Alert icon={<IconAlertCircle />} color="red">
              Error: {streetsError}
            </Alert>
          )}
          <Input.Wrapper>
            <Input.Label>Search distance</Input.Label>
            <Slider
              mt="xs"
              label={(value) => `${value} m`}
              min={1}
              max={50}
              value={streetSearchDistance}
              onChange={updateStreetSearchDistance}
            />
          </Input.Wrapper>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  )
}
