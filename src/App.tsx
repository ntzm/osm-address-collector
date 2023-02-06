import { useState } from "react"
import { move } from "./geo"
import IconButton from "./IconButton"
import KeypadButton from "./KeypadButton"
import KeypadNumber from "./KeypadNumber"
import Map from "./Map"
import { getOsmFile } from "./osm-xml"
import Settings from "./Settings"
import SubmitButton from "./SubmitButton"
import TopBar from "./TopBar"
import { Address, CustomTag, DeviceOrientationEventiOS, Direction, Note, SurveyState, WebkitDeviceOrientationEvent } from "./types"
import {saveAs} from 'file-saver-es'

const notes: Note[] = [
  {
    latitude: 51.515,
    longitude: -0.09,
    content: 'Hello',
  },
]

const history = [
  '+ 5 R',
  '+ 23 L',
]

const skippedNumbers: number[] = []
const orientation = 0

function App() {
  const [mapOpen, setMapOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [currentNumberOrName, setCurrentNumberOrName] = useState('')
  const [street, setStreet] = useState('')
  const [streetSearchDistance, setStreetSearchDistance] = useState(10)
  const [customTags, setCustomTags] = useState<CustomTag[]>([])
  const [throwDistance, setThrowDistance] = useState(10)
  const [skipNumbers, setSkipNumbers] = useState<number[]>([])
  const [surveyState, setSurveyState] = useState<SurveyState>('not started')
  const [position, setPosition] = useState<GeolocationCoordinates | undefined>(undefined)
  const [heading, setHeading] = useState<number | undefined>(undefined)
  const [addresses, setAddresses] = useState<Address[]>([
    {
      latitude: 51.505,
      longitude: -0.09,
      numberOrName: '5',
      skippedNumbers: [],
      street: 'Foo',
      customTags: [],
      direction: 'L',
    },
  ])
  const appendNumber = (number: number) => {
    setCurrentNumberOrName(currentNumberOrName + String(number))
  }
  const submit = (direction: Direction) => {
    if (position === undefined) {
      // todo: type check
      return
    }

    let bearing = orientation

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

    setAddresses([...addresses, newAddress])
    setCurrentNumberOrName('')
  }

  const canRequestOrientationPermission = (event: typeof DeviceOrientationEvent | DeviceOrientationEventiOS): event is DeviceOrientationEventiOS => {
    return 'requestPermission' in event
  }

  const isOrientationEvent = (event: Event): event is DeviceOrientationEvent => {
    return 'alpha' in event && 'beta' in event && 'gamma' in event
  }

  const isWebkitOrientationEvent = (event: DeviceOrientationEvent): event is WebkitDeviceOrientationEvent => {
    return 'webkitCompassHeading' in event
  }

  const invertBearing = (bearing: number) => Math.abs(bearing - 360)

  const startOrPause = async () => {
    if (surveyState === 'not started') {
      setSurveyState('starting')

      if (canRequestOrientationPermission(DeviceOrientationEvent)) {
        const permissionState = await DeviceOrientationEvent.requestPermission()
    
        if (permissionState !== 'granted') {
          alert('Device orientation permission is required, please allow!')
        }
      }

      const handleHeading = (event: Event) => {
        if (!isOrientationEvent(event)) {
          // todo what do
          return
        }

        if (isWebkitOrientationEvent(event)) {
          setHeading(event.webkitCompassHeading)
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
      }

      window.addEventListener('deviceorientationabsolute', handleHeading)
      window.addEventListener('deviceorientation', handleHeading)

      navigator.geolocation.watchPosition(
        position => {
          setPosition(position.coords)
          setSurveyState('started')
        },
        errorEvent => {
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

      return
    }

    if (surveyState === 'started') {
      setSurveyState('paused')
      return
    }

    if (surveyState === 'paused') {
      setSurveyState('started')
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
      xml => new XMLSerializer().serializeToString(xml),
      addresses,
      notes,
      date,
    )
  
    saveAs(
      new Blob([contents], {type: 'application/vnd.osm+xml'}),
      `${getFormattedDate(date)}.osm`,
    )
  }

  const surveyDisabled = surveyState !== 'started'

  return <>
    {mapOpen ? <Map addresses={addresses} notes={notes} onClose={() => setMapOpen(false)} /> : ''}
    {
      settingsOpen
      ? <Settings
        onClose={() => setSettingsOpen(false)}
        street={street}
        onStreetChange={setStreet}
        streetSearchDistance={streetSearchDistance}
        onStreetSearchDistanceChange={setStreetSearchDistance}
        customTags={customTags}
        onCustomTagsChange={setCustomTags}
        throwDistance={throwDistance}
        onThrowDistanceChange={setThrowDistance}
        skipNumbers={skipNumbers}
        onSkipNumbersChange={setSkipNumbers}
      />
      : ''
    }

    <div className="container">
      <TopBar
        onOpenMap={() => setMapOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        accuracy={position?.accuracy}
        history={history}
      />

      <div className="row">
        <input type="text" id="current-number-or-name" autoCapitalize="words" value={currentNumberOrName} onChange={(e) => setCurrentNumberOrName(e.target.value)} />
      </div>

      <div className="row">
        <SubmitButton disabled={surveyDisabled} direction="L" onClick={submit} />
        <SubmitButton disabled={surveyDisabled} direction="F" onClick={submit} />
        <SubmitButton disabled={surveyDisabled} direction="R" onClick={submit} />
      </div>

      <div className="row">
        <KeypadNumber disabled={surveyDisabled} number={1} onClick={appendNumber} />
        <KeypadNumber disabled={surveyDisabled} number={2} onClick={appendNumber} />
        <KeypadNumber disabled={surveyDisabled} number={3} onClick={appendNumber} />
      </div>

      <div className="row">
        <KeypadNumber disabled={surveyDisabled} number={4} onClick={appendNumber} />
        <KeypadNumber disabled={surveyDisabled} number={5} onClick={appendNumber} />
        <KeypadNumber disabled={surveyDisabled} number={6} onClick={appendNumber} />
      </div>

      <div className="row">
        <KeypadNumber disabled={surveyDisabled} number={7} onClick={appendNumber} />
        <KeypadNumber disabled={surveyDisabled} number={8} onClick={appendNumber} />
        <KeypadNumber disabled={surveyDisabled} number={9} onClick={appendNumber} />
      </div>

      <div className="row">
        <KeypadButton disabled={['starting', 'finishing'].includes(surveyState)} onClick={startOrPause}>{surveyState === 'started' ? 'Pause' : 'Start'}</KeypadButton>
        <KeypadNumber disabled={surveyDisabled} number={0} onClick={appendNumber} />
        <IconButton disabled={surveyDisabled} src="icons/clear_black_24dp.svg" onClick={() => setCurrentNumberOrName('')} />
      </div>

      <div className="row">
        <button id="add-note" className="disabled">
          <img className="button-icon" src="icons/note_black_24dp.svg" />
        </button>
        <button disabled={!['started', 'paused'].includes(surveyState)} onClick={done}>Done</button>
        <button id="undo" className="disabled">
          <img className="button-icon" src="icons/undo_black_24dp.svg" />
        </button>
      </div>
    </div>
  </>
}

export default App
