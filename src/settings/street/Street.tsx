import { useState } from 'react'
import { useBoundStore } from '../../store'
import findNearestStreets from './find-nearest-streets'
import SettingCategory from '../SettingCategory'

export default function Street() {
  const help = `Add a street to address nodes.
The street you choose will only be applied to addresses going forward.
You can type in the street name manually, or click "Get streets" to retrieve a list of streets near to you.
You can change the distance it will look for nearby streets with the "Street search distance" slider.`

  const position = useBoundStore((s) => s.position)

  const street = useBoundStore((s) => s.street)
  const updateStreet = useBoundStore((s) => s.updateStreet)

  const streetSearchDistance = useBoundStore((s) => s.streetSearchDistance)
  const updateStreetSearchDistance = useBoundStore(
    (s) => s.updateStreetSearchDistance,
  )

  const [streets, setStreets] = useState<string[]>([])
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
    setStreets(newStreets)
  }

  return (
    <SettingCategory heading="Street" help={help}>
      <datalist id="streets">
        {streets.map((street) => (
          <option key={street} value={street} />
        ))}
      </datalist>

      <div className="setting">
        <input
          className="setting-input"
          type="text"
          id="street"
          list="streets"
          placeholder="Street"
          autoComplete="off"
          value={street}
          onChange={(e) => updateStreet(e.target.value)}
        />
      </div>

      <div className="setting">
        <button
          className="setting-button"
          disabled={streetsStatus === 'getting' || position === undefined}
          onClick={getStreets}
        >
          Get streets
        </button>
        {streetsStatus === 'none' && 'Click "Get streets" to get streets'}
        {streetsStatus === 'getting' && 'Getting streets...'}
        {streetsStatus === 'complete' && (
          <span style={{ color: 'green' }}>
            Got {streets.length} street{streets.length === 1 ? '' : 's'}
          </span>
        )}
        {streetsStatus === 'error' && (
          <span style={{ color: 'red' }}>Error: {streetsError}</span>
        )}
        <p className="disclaimer">
          Street data from{' '}
          <a
            href="https://openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            OpenStreetMap
          </a>
        </p>
      </div>

      <div className="setting">
        <label htmlFor="street-search-distance">
          Street search distance: {streetSearchDistance}m
        </label>
        <br />
        <input
          className="setting-input"
          type="range"
          id="street-search-distance"
          min="0"
          max="50"
          value={streetSearchDistance}
          onChange={(e) => updateStreetSearchDistance(Number(e.target.value))}
        />
      </div>
    </SettingCategory>
  )
}