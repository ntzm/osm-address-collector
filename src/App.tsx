import { useState } from "react"
import { move } from "./geo"
import IconButton from "./IconButton"
import KeypadNumber from "./KeypadNumber"
import Map from "./Map"
import Settings from "./Settings"
import SubmitButton from "./SubmitButton"
import TopBar from "./TopBar"
import { Address, CustomTag, Direction, Note } from "./types"

const notes: Note[] = [
  {
    latitude: 51.515,
    longitude: -0.09,
    content: 'Hello',
  },
]

const currentPosition = {
  latitude: 51.515,
  longitude: -0.09,
  accuracy: 5,
}

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

    const movedPosition = move(currentPosition, bearing, throwDistance)

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
  }

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
        accuracy={currentPosition.accuracy}
        history={history}
      />

      <div className="row">
        <input type="text" id="current-number-or-name" autoCapitalize="words" value={currentNumberOrName} onChange={(e) => setCurrentNumberOrName(e.target.value)} />
      </div>

      <div className="row">
        <SubmitButton direction="L" onClick={submit} />
        <SubmitButton direction="F" onClick={submit} />
        <SubmitButton direction="R" onClick={submit} />
      </div>

      <div className="row">
        <KeypadNumber number={1} onClick={appendNumber} />
        <KeypadNumber number={2} onClick={appendNumber} />
        <KeypadNumber number={3} onClick={appendNumber} />
      </div>

      <div className="row">
        <KeypadNumber number={4} onClick={appendNumber} />
        <KeypadNumber number={5} onClick={appendNumber} />
        <KeypadNumber number={6} onClick={appendNumber} />
      </div>

      <div className="row">
        <KeypadNumber number={7} onClick={appendNumber} />
        <KeypadNumber number={8} onClick={appendNumber} />
        <KeypadNumber number={9} onClick={appendNumber} />
      </div>

      <div className="row">
        <button id="start-or-pause">Start</button>
        <KeypadNumber number={0} onClick={appendNumber} />
        <IconButton src="icons/clear_black_24dp.svg" onClick={() => setCurrentNumberOrName('')} />
      </div>

      <div className="row">
        <button id="add-note" className="disabled">
          <img className="button-icon" src="icons/note_black_24dp.svg" />
        </button>
        <button id="done" className="disabled">Done</button>
        <button id="undo" className="disabled">
          <img className="button-icon" src="icons/undo_black_24dp.svg" />
        </button>
      </div>
    </div>
  </>
}

export default App
