import { useState } from 'react'
import { move } from './geo'
import IconButton from './IconButton'
import KeypadButton from './KeypadButton'
import KeypadNumber from './KeypadNumber'
import Map from './map/Map'
import { getOsmFile } from './osm-xml'
import Settings from './settings/Settings'
import SubmitButton from './SubmitButton'
import TopBar from './TopBar'
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

function App() {
  const addresses = useBoundStore((s) => s.addresses)
  const addAddress = useBoundStore((s) => s.addAddress)
  const removeLastAddress = useBoundStore((s) => s.removeLastAddress)
  const clearAddresses = useBoundStore((s) => s.clearAddresses)

  const notes = useBoundStore((s) => s.notes)
  const dispatchAddNote = useBoundStore((s) => s.addNote)
  const clearNotes = useBoundStore((s) => s.clearNotes)

  const position = useBoundStore((s) => s.position)
  const updatePosition = useBoundStore((s) => s.updatePosition)
  const clearPosition = useBoundStore((s) => s.clearPosition)

  const customTags = useBoundStore((s) => s.customTags)
  const skipNumbers = useBoundStore((s) => s.skipNumbers)
  const street = useBoundStore((s) => s.street)
  const throwDistance = useBoundStore((s) => s.throwDistance)

  const [mapOpen, setMapOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [noteWriterOpen, setNoteWriterOpen] = useState(false)
  const [currentNumberOrName, setCurrentNumberOrName] = useState('')
  const [surveyState, setSurveyState] = useState<SurveyState>('not started')
  const [positionWatchId, setPositionWatchId] = useState<number | undefined>(
    undefined,
  )
  const [heading, setHeading] = useState<number | undefined>(undefined)
  const [headingProvider, setHeadingProvider] = useState<
    'Webkit compass heading' | 'Device orientation' | 'GPS heading' | undefined
  >(undefined)
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
  const addNote = (content: string) => {
    if (position === undefined) {
      // todo type checking
      return
    }

    dispatchAddNote({
      latitude: position.latitude,
      longitude: position.longitude,
      content,
    })

    addAction('+ note')
  }
  const appendNumber = (number: number) => {
    clearGuess()
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
      setHeading(event.webkitCompassHeading)
      setHeadingProvider('Webkit compass heading')
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

    setHeading(heading)
    setHeadingProvider('Device orientation')
  }

  const startOrPause = async () => {
    if (
      surveyState === 'not started' &&
      (addresses.length > 0 || notes.length > 0) &&
      !confirm(
        `You have ${addresses.length} unsaved address${
          addresses.length === 1 ? '' : 'es'
        } and ${notes.length} unsaved note${
          notes.length === 1 ? '' : 's'
        } from the previous session, do you want to load them?`,
      )
    ) {
      clearAddresses()
      clearNotes()
    }

    if (surveyState === 'not started' || surveyState == 'paused') {
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

            setHeading(gpsHeading)
            setHeadingProvider('GPS heading')
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
      setHeading(undefined)
      setHeadingProvider(undefined)
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
    setHeading(undefined)
    setHeadingProvider(undefined)
    setCurrentNumberOrName('')
    setLastActions([])
    setSkippedNumbers([])
    setNumberIsGuessed(false)
    // should we clear street as well?

    setSurveyState('not started')
  }

  const surveyDisabled = surveyState !== 'started'

  return (
    <>
      {mapOpen && <Map onClose={() => setMapOpen(false)} />}
      {settingsOpen && (
        <Settings
          heading={heading}
          headingProvider={headingProvider}
          onClose={() => setSettingsOpen(false)}
        />
      )}
      {noteWriterOpen && (
        <NoteWriter onClose={() => setNoteWriterOpen(false)} onAdd={addNote} />
      )}

      <div className="container">
        <TopBar
          onOpenMap={() => setMapOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          accuracy={position?.accuracy}
          lastActions={lastActions}
        />

        <div className="row">
          <input
            type="text"
            id="current-number-or-name"
            autoCapitalize="words"
            value={currentNumberOrName}
            onChange={(e) => setCurrentNumberOrName(e.target.value)}
            onFocus={clearGuess}
            style={numberIsGuessed ? { color: '#999' } : {}}
          />
        </div>

        <div className="row">
          <SubmitButton
            disabled={surveyDisabled}
            direction="L"
            onClick={submit}
          />
          <SubmitButton
            disabled={surveyDisabled}
            direction="F"
            onClick={submit}
          />
          <SubmitButton
            disabled={surveyDisabled}
            direction="R"
            onClick={submit}
          />
        </div>

        <div className="row">
          <KeypadNumber
            disabled={surveyDisabled}
            number={1}
            onClick={appendNumber}
          />
          <KeypadNumber
            disabled={surveyDisabled}
            number={2}
            onClick={appendNumber}
          />
          <KeypadNumber
            disabled={surveyDisabled}
            number={3}
            onClick={appendNumber}
          />
        </div>

        <div className="row">
          <KeypadNumber
            disabled={surveyDisabled}
            number={4}
            onClick={appendNumber}
          />
          <KeypadNumber
            disabled={surveyDisabled}
            number={5}
            onClick={appendNumber}
          />
          <KeypadNumber
            disabled={surveyDisabled}
            number={6}
            onClick={appendNumber}
          />
        </div>

        <div className="row">
          <KeypadNumber
            disabled={surveyDisabled}
            number={7}
            onClick={appendNumber}
          />
          <KeypadNumber
            disabled={surveyDisabled}
            number={8}
            onClick={appendNumber}
          />
          <KeypadNumber
            disabled={surveyDisabled}
            number={9}
            onClick={appendNumber}
          />
        </div>

        <div className="row">
          <KeypadButton
            disabled={['starting', 'finishing'].includes(surveyState)}
            onClick={startOrPause}
          >
            {surveyState === 'started' ? 'Pause' : 'Start'}
          </KeypadButton>
          <KeypadNumber
            disabled={surveyDisabled}
            number={0}
            onClick={appendNumber}
          />
          <IconButton
            disabled={surveyDisabled}
            src="icons/clear_black_24dp.svg"
            onClick={clearNumberOrName}
            colour="#faa0a0"
          />
        </div>

        <div className="row">
          <IconButton
            src="icons/note_black_24dp.svg"
            disabled={surveyDisabled}
            onClick={() => setNoteWriterOpen(true)}
          />
          <KeypadButton
            disabled={!['started', 'paused'].includes(surveyState)}
            onClick={done}
            colour="#aec6cf"
          >
            Done
          </KeypadButton>
          <IconButton
            src="icons/undo_black_24dp.svg"
            disabled={surveyDisabled}
            onClick={undo}
          />
        </div>
      </div>
    </>
  )
}

export default App
