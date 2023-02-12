import { useState } from 'react'
import { move } from './geo'
import Map from './map/Map'
import { getOsmFile } from './osm-xml'
import Settings from './settings/Settings'
import {
  DeviceOrientationEventiOS,
  Direction,
  SurveyState,
  WebkitDeviceOrientationEvent,
} from './types'
import { saveAs } from 'file-saver-es'
import NoteWriter from './notes/NoteWriter'
import guessNextNumber from './guess-next-number'
import { useBoundStore } from './store'
import {
  ActionIcon,
  AppShell,
  Button,
  Container,
  Grid,
  Group,
  Header,
  LoadingOverlay,
  Modal,
  Stack,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core'
import {
  IconArrowBackUp,
  IconArrowLeft,
  IconArrowRight,
  IconArrowUp,
  IconBorderAll,
  IconBrain,
  IconHomePlus,
  IconMap,
  IconNote,
  IconSettings,
  IconTrash,
  IconX,
} from '@tabler/icons-react'

function App() {
  const addresses = useBoundStore((s) => s.addresses)
  const addAddress = useBoundStore((s) => s.addAddress)
  const removeLastAddress = useBoundStore((s) => s.removeLastAddress)
  const clearAddresses = useBoundStore((s) => s.clearAddresses)

  const notes = useBoundStore((s) => s.notes)
  const clearNotes = useBoundStore((s) => s.clearNotes)

  const position = useBoundStore((s) => s.position)
  const updatePosition = useBoundStore((s) => s.updatePosition)
  const clearPosition = useBoundStore((s) => s.clearPosition)

  const customTags = useBoundStore((s) => s.customTags)
  const skipNumbers = useBoundStore((s) => s.skipNumbers)
  const street = useBoundStore((s) => s.street)
  const throwDistance = useBoundStore((s) => s.throwDistance)

  const heading = useBoundStore((s) => s.heading)
  const updateHeading = useBoundStore((s) => s.updateHeading)
  const clearHeading = useBoundStore((s) => s.clearHeading)

  const headingProvider = useBoundStore((s) => s.headingProvider)
  const updateHeadingProvider = useBoundStore((s) => s.updateHeadingProvider)
  const clearHeadingProvider = useBoundStore((s) => s.clearHeadingProvider)

  const [page, setPage] = useState<
    'keypad' | 'map' | 'note-writer' | 'settings'
  >('keypad')

  const [currentNumberOrName, setCurrentNumberOrName] = useState('')
  const [surveyState, setSurveyState] = useState<SurveyState>('not started')
  const [positionWatchId, setPositionWatchId] = useState<number | undefined>(
    undefined,
  )
  const [lastActions, setLastActions] = useState<string[]>([])
  const [skippedNumbers, setSkippedNumbers] = useState<number[]>([])
  const [numberIsGuessed, setNumberIsGuessed] = useState(false)
  const clearGuess = () => {
    if (numberIsGuessed) {
      setNumberIsGuessed(false)
      setCurrentNumberOrName('')
    }
  }
  const clearNumberOrName = () => {
    setCurrentNumberOrName('')
    clearGuess()
  }
  const addAction = (action: string) => {
    setLastActions([
      action,
      ...(lastActions[0] === undefined ? [] : [lastActions[0]]),
    ])
  }
  const appendNumber = (number: number) => {
    if (numberIsGuessed) {
      setNumberIsGuessed(false)
      setCurrentNumberOrName(String(number))
      return
    }

    setCurrentNumberOrName(currentNumberOrName + String(number))
  }
  const submit = (direction: Direction) => {
    if (position === undefined || heading === undefined) {
      // todo: type check
      return
    }

    let bearing = heading

    if (direction === 'L') {
      bearing -= 90
    }

    if (direction === 'R') {
      bearing += 90
    }

    bearing %= 360

    if (bearing < 0) {
      bearing += 360
    }

    const movedPosition = move(position, bearing, throwDistance)

    const newAddress = {
      latitude: movedPosition.latitude,
      longitude: movedPosition.longitude,
      numberOrName: currentNumberOrName,
      skippedNumbers,
      street,
      customTags,
      direction,
    }

    const newAddresses = [...addresses, newAddress]
    addAddress(newAddress)
    addAction(`+ ${direction} ${currentNumberOrName}`)

    const [guessedNextNumber, lastSkippedNumbers] = guessNextNumber(
      newAddresses,
      skipNumbers.map(Number).filter((n) => Number.isNaN(n)),
    )

    if (guessedNextNumber === undefined) {
      setCurrentNumberOrName('')
      return
    }

    setSkippedNumbers(lastSkippedNumbers)
    setCurrentNumberOrName(String(guessedNextNumber))
    setNumberIsGuessed(true)
  }
  const undo = () => {
    const lastIndex = addresses.length - 1
    const last = addresses[lastIndex]

    if (last === undefined) {
      return
    }

    addAction(`- ${last.direction} ${last.numberOrName}`)

    removeLastAddress()
  }

  const canRequestOrientationPermission = (
    event: typeof DeviceOrientationEvent | DeviceOrientationEventiOS,
  ): event is DeviceOrientationEventiOS => {
    return 'requestPermission' in event
  }

  const isOrientationEvent = (
    event: Event,
  ): event is DeviceOrientationEvent => {
    return 'alpha' in event && 'beta' in event && 'gamma' in event
  }

  const isWebkitOrientationEvent = (
    event: DeviceOrientationEvent,
  ): event is WebkitDeviceOrientationEvent => {
    return 'webkitCompassHeading' in event
  }

  const invertBearing = (bearing: number) => Math.abs(bearing - 360)

  const handleHeading = (event: Event) => {
    if (!isOrientationEvent(event)) {
      // todo what do
      return
    }

    if (isWebkitOrientationEvent(event)) {
      updateHeading(event.webkitCompassHeading)
      updateHeadingProvider('Webkit compass heading')
      return
    }

    if (!event.absolute) {
      // todo fall back to gps heading
      return
    }

    let heading = 0

    // Fix for chrome on non-mobile - for testing
    if (event.alpha !== null) {
      heading = invertBearing(event.alpha)
    }

    updateHeading(heading)
    updateHeadingProvider('Device orientation')
  }

  const [loadLastSessionModalOpened, setLoadLastSessionModalOpened] =
    useState(false)

  const deleteLastSession = () => {
    clearAddresses()
    clearNotes()
    setLoadLastSessionModalOpened(false)
    startOrPause()
  }

  const startOrPause = async () => {
    if (
      surveyState === 'not started' &&
      (addresses.length > 0 || notes.length > 0)
    ) {
      setLoadLastSessionModalOpened(true)
      setSurveyState('starting')
      return
    }

    if (
      surveyState === 'starting' ||
      surveyState === 'not started' ||
      surveyState == 'paused'
    ) {
      setSurveyState('starting')

      if (canRequestOrientationPermission(DeviceOrientationEvent)) {
        const permissionState = await DeviceOrientationEvent.requestPermission()

        if (permissionState !== 'granted') {
          alert('Device orientation permission is required, please allow!')
        }
      }

      window.addEventListener('deviceorientationabsolute', handleHeading)
      window.addEventListener('deviceorientation', handleHeading)

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          updatePosition(position.coords)
          setSurveyState('started')

          if (
            headingProvider === undefined ||
            headingProvider === 'GPS heading'
          ) {
            const gpsHeading = position.coords.heading

            if (gpsHeading === null) {
              return
            }

            // if we haven't moved, it's NaN
            if (Number.isNaN(gpsHeading)) {
              return
            }

            updateHeading(gpsHeading)
            updateHeadingProvider('GPS heading')
          }
        },
        (errorEvent) => {
          setSurveyState('error')

          if (errorEvent.code === errorEvent.PERMISSION_DENIED) {
            alert(`GPS permission denied: ${errorEvent.message}`)
            return
          }

          if (errorEvent.code === errorEvent.POSITION_UNAVAILABLE) {
            alert(`GPS position unavailable: ${errorEvent.message}`)
            return
          }

          if (errorEvent.code === errorEvent.TIMEOUT) {
            alert(`GPS position timeout: ${errorEvent.message}`)
          }

          alert('GPS position unknown error')
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
        },
      )

      setPositionWatchId(watchId)

      return
    }

    if (surveyState === 'started') {
      setSurveyState('paused')
      if (positionWatchId !== undefined) {
        navigator.geolocation.clearWatch(positionWatchId)
        setPositionWatchId(undefined)
      }
      window.removeEventListener('deviceorientationabsolute', handleHeading)
      window.removeEventListener('deviceorientation', handleHeading)
      clearPosition()
      clearHeading()
      clearHeadingProvider()
      return
    }

    // todo what do
  }

  const getFormattedDate = (date: Date) =>
    date.toISOString().slice(0, 19).replace('T', '-').replace(/:/g, '')

  const done = () => {
    setSurveyState('finishing')

    const date = new Date()

    const contents = getOsmFile(
      document.implementation,
      (xml) => new XMLSerializer().serializeToString(xml),
      addresses,
      notes,
      date,
    )

    saveAs(
      new Blob([contents], { type: 'application/vnd.osm+xml' }),
      `${getFormattedDate(date)}.osm`,
    )

    clearAddresses()
    clearNotes()
    if (positionWatchId !== undefined) {
      navigator.geolocation.clearWatch(positionWatchId)
      setPositionWatchId(undefined)
    }
    window.removeEventListener('deviceorientationabsolute', handleHeading)
    window.removeEventListener('deviceorientation', handleHeading)
    clearPosition()
    clearHeading()
    clearHeadingProvider()
    setCurrentNumberOrName('')
    setLastActions([])
    setSkippedNumbers([])
    setNumberIsGuessed(false)
    // should we clear street as well?

    setSurveyState('not started')
  }

  const surveyDisabled = surveyState !== 'started'

  return (
    <AppShell
      header={
        <Header height={70} withBorder={false}>
          <Container size="xs" mt="xs">
            <Tabs
              value={page}
              onTabChange={(page) =>
                page &&
                setPage(page as 'keypad' | 'map' | 'note-writer' | 'settings')
              }
              variant="outline"
              defaultValue="keypad"
            >
              <Tabs.List grow>
                <Tabs.Tab icon={<IconBorderAll />} value="keypad">
                  Keypad
                </Tabs.Tab>
                <Tabs.Tab
                  icon={<IconMap />}
                  value="map"
                  disabled={position === undefined}
                >
                  Map
                </Tabs.Tab>
                <Tabs.Tab icon={<IconSettings />} value="settings">
                  Settings
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </Container>
        </Header>
      }
    >
      <NoteWriter
        isOpened={page === 'note-writer'}
        onClose={() => setPage('keypad')}
      />

      <Modal
        opened={loadLastSessionModalOpened}
        withCloseButton={false}
        onClose={deleteLastSession}
        centered
      >
        <Stack>
          <Text>
            You have {addresses.length} unsaved address
            {addresses.length === 1 ? '' : 'es'} and {notes.length} unsaved note
            {notes.length === 1 ? '' : 's'} from the previous session, do you
            want to load them?
          </Text>
          <Group position="apart">
            <Button
              p="xs"
              variant="outline"
              color="red"
              leftIcon={<IconTrash />}
              onClick={deleteLastSession}
            >
              No, delete them
            </Button>
            <Button
              p="xs"
              onClick={() => {
                startOrPause()
                setLoadLastSessionModalOpened(false)
              }}
            >
              Yes, load them
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Container size="xs" px={0} h="100%">
        {page === 'settings' && <Settings />}
        {page === 'map' && <Map />}

        <LoadingOverlay visible={surveyState === 'finishing'} />

        {page === 'keypad' && (
          <Grid h="100%" m={0} gutter="xs">
            <Grid.Col span={12}>
              <TextInput
                size="xl"
                placeholder="House number or name"
                value={currentNumberOrName}
                onChange={(e) => setCurrentNumberOrName(e.target.value)}
                icon={
                  numberIsGuessed ? (
                    <IconBrain color="green" />
                  ) : (
                    <IconHomePlus />
                  )
                }
                autoCapitalize="words"
                onFocus={clearGuess}
                disabled={surveyDisabled}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <ActionIcon
                variant="light"
                w="100%"
                h="100%"
                size="xl"
                onClick={() => submit('L')}
                disabled={surveyDisabled}
              >
                <IconArrowLeft />
              </ActionIcon>
            </Grid.Col>
            <Grid.Col span={4}>
              <ActionIcon
                variant="light"
                w="100%"
                h="100%"
                size="xl"
                onClick={() => submit('F')}
                disabled={surveyDisabled}
              >
                <IconArrowUp />
              </ActionIcon>
            </Grid.Col>
            <Grid.Col span={4}>
              <ActionIcon
                variant="light"
                w="100%"
                h="100%"
                size="xl"
                onClick={() => submit('R')}
                disabled={surveyDisabled}
              >
                <IconArrowRight />
              </ActionIcon>
            </Grid.Col>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <Grid.Col key={n} span={4}>
                <Button
                  p="xs"
                  w="100%"
                  h="100%"
                  variant="light"
                  size="xl"
                  onClick={() => appendNumber(n)}
                  onTouchStart={() => appendNumber(n)}
                  onTouchEnd={(e) => e.preventDefault()}
                  disabled={surveyDisabled}
                >
                  {n}
                </Button>
              </Grid.Col>
            ))}
            <Grid.Col span={4}>
              <Button
                p="xs"
                w="100%"
                h="100%"
                variant="filled"
                size="xl"
                onClick={startOrPause}
                disabled={['starting', 'finishing'].includes(surveyState)}
              >
                {surveyState === 'started' ? 'Pause' : 'Start'}
              </Button>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                p="xs"
                w="100%"
                h="100%"
                variant="light"
                size="xl"
                onClick={() => appendNumber(0)}
                onTouchStart={() => appendNumber(0)}
                onTouchEnd={(e) => e.preventDefault()}
                disabled={surveyDisabled}
              >
                0
              </Button>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                p="xs"
                w="100%"
                h="100%"
                variant="light"
                leftIcon={<IconX />}
                disabled={surveyDisabled}
                onClick={clearNumberOrName}
              >
                Clear
              </Button>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                p="xs"
                w="100%"
                h="100%"
                variant="light"
                onClick={() => setPage('note-writer')}
                leftIcon={<IconNote />}
                disabled={surveyDisabled}
              >
                Note
              </Button>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                p="xs"
                w="100%"
                h="100%"
                variant="filled"
                size="xl"
                disabled={!['started', 'paused'].includes(surveyState)}
                onClick={done}
              >
                Done
              </Button>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                p="xs"
                w="100%"
                h="100%"
                variant="light"
                leftIcon={<IconArrowBackUp />}
                disabled={surveyDisabled}
                onClick={undo}
              >
                Undo
              </Button>
            </Grid.Col>
          </Grid>
        )}
      </Container>
    </AppShell>
  )
}

export default App
