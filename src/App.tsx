import { useState } from "react"
import Map from "./Map"
import { Address, Note } from "./types"

const addresses: Address[] = [
  {
    latitude: 51.505,
    longitude: -0.09,
    numberOrName: '5',
    skippedNumbers: [],
    street: 'Foo',
    customTags: {},
    direction: 'L',
  },
]

const notes: Note[] = [
  {
    latitude: 51.515,
    longitude: -0.09,
    content: 'Hello',
  },
]

function App() {
  const [mapOpen, setMapOpen] = useState(false)

  return <>
    <button onClick={() => setMapOpen(true)}>Open map</button>
    {mapOpen ? <Map addresses={addresses} notes={notes} onClose={() => setMapOpen(false)} /> : ''}
  </>
}

export default App
