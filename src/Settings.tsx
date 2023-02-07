import { useState } from 'react'
import styled from 'styled-components'
import findNearestStreets from './find-nearest-streets'
import { useBoundStore } from './store'

const SettingsPopup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  height: 100%;
  background: #fff;
  z-index: 5;
  font-size: 14pt;
`

export default function Settings(props: {
  heading: number | undefined
  headingProvider: string | undefined
  onClose: () => void
}) {
  const position = useBoundStore((s) => s.position)

  const skipNumbers = useBoundStore((s) => s.skipNumbers)
  const addSkipNumber = useBoundStore((s) => s.addSkipNumber)
  const updateSkipNumber = useBoundStore((s) => s.updateSkipNumber)
  const removeSkipNumber = useBoundStore((s) => s.removeSkipNumber)

  const customTags = useBoundStore((s) => s.customTags)
  const addCustomTag = useBoundStore((s) => s.addCustomTag)
  const updateCustomTagKey = useBoundStore((s) => s.updateCustomTagKey)
  const updateCustomTagValue = useBoundStore((s) => s.updateCustomTagValue)
  const removeCustomTag = useBoundStore((s) => s.removeCustomTag)

  const street = useBoundStore((s) => s.street)
  const updateStreet = useBoundStore((s) => s.updateStreet)

  const throwDistance = useBoundStore((s) => s.throwDistance)
  const updateThrowDistance = useBoundStore((s) => s.updateThrowDistance)

  const [streetSearchDistance, setStreetSearchDistance] = useState(10)
  const [overpassEndpoint, setOverpassEndpoint] = useState(
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  )
  const [overpassTimeout, setOverpassTimeout] = useState(10_000)
  const [streets, setStreets] = useState<string[]>([])
  const [streetsStatus, setStreetsStatus] = useState<
    'none' | 'getting' | 'complete' | 'error'
  >('none')
  const [streetsError, setStreetsError] = useState<string | undefined>(
    undefined,
  )

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
        overpassTimeout,
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

  const showGeneralHelp = () => {
    alert(
      `Choose a distance to throw address nodes from your current position.
If you add an address node by pressing the left arrow key, it will throw the node to your left by this amount.`,
    )
  }

  const showStreetHelp = () => {
    alert(
      `Add a street to address nodes.
The street you choose will only be applied to addresses going forward.
You can type in the street name manually, or click "Get streets" to retrieve a list of streets near to you.
You can change the distance it will look for nearby streets with the "Street search distance" slider.`,
    )
  }

  const showCustomTagHelp = () => {
    alert(
      `Add custom OSM tags to each address node.
The tags you add will only be applied to addresses going forward.`,
    )
  }

  const showAdvancedHelp = () => {
    alert(
      `Orientation is used to throw address nodes in the correct direction.
Orientation provider shows the method to get your device's orientation.
Orientation shows your device's current orientation.
We use Overpass API to find streets nearby to you.
You can customise the timeout and the endpoint here.
Do not change the endpoint unless you know what you are doing!`,
    )
  }

  const showSkipNumbersHelp = () => {
    alert(
      `Choose some numbers to skip when the app tries to guess the next number in the sequence.
For example, in the UK the number 13 is often skipped.`,
    )
  }

  return (
    <SettingsPopup>
      <button onClick={() => props.onClose()}>x</button>

      <div className="setting-category">
        <h2 className="setting-category__heading" onClick={showStreetHelp}>
          <span className="setting-category__info">ⓘ</span>
          Street
        </h2>

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
            onChange={(e) => setStreetSearchDistance(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="setting-category">
        <h2 className="setting-category__heading" onClick={showCustomTagHelp}>
          <span className="setting-category__info">ⓘ</span>
          Custom tags
        </h2>

        <datalist id="tag-keys">
          <option value="addr:city" />
          <option value="addr:postcode" />
          <option value="addr:country" />
          <option value="addr:state" />
          <option value="addr:place" />
          <option value="addr:suburb" />
          <option value="addr:province" />
          <option value="addr:district" />
          <option value="addr:subdistrict" />
          <option value="addr:hamlet" />
          <option value="addr:village" />
          <option value="addr:town" />
          <option value="addr:county" />
        </datalist>

        <div className="setting">
          <div className="setting-list">
            <div id="custom-tags">
              {customTags.map((customTag, i) => (
                <div key={i} className="custom-tag setting-list__row">
                  <button onClick={() => removeCustomTag(i)}>x</button>
                  <input
                    className="key-input setting-input setting-list__input"
                    type="text"
                    placeholder="Key"
                    autoCapitalize="none"
                    list="tag-keys"
                    value={customTag.key}
                    onChange={(e) => updateCustomTagKey(i, e.target.value)}
                  />
                  <input
                    className="value-input setting-input setting-list__input"
                    type="text"
                    placeholder="Value"
                    value={customTag.value}
                    onChange={(e) => updateCustomTagValue(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button
              className="setting-list__add"
              id="add-custom-tag"
              onClick={() => addCustomTag({ key: '', value: '' })}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="setting-category">
        <h2 className="setting-category__heading" onClick={showGeneralHelp}>
          <span className="setting-category__info">ⓘ</span>
          General
        </h2>

        <div className="setting">
          <label htmlFor="distance">Throw distance: {throwDistance}m</label>
          <input
            className="setting-input"
            type="range"
            id="distance"
            min="1"
            max="100"
            value={throwDistance}
            onChange={(e) => updateThrowDistance(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="setting-category">
        <h2 className="setting-category__heading" onClick={showSkipNumbersHelp}>
          <span className="setting-category__info">ⓘ</span>
          Skip numbers
        </h2>

        <div className="setting">
          <div className="setting-list">
            <div id="skip-numbers">
              {skipNumbers.map((skip, i) => (
                <div key={i} className="skip-number setting-list__row">
                  <button onClick={() => removeSkipNumber(i)}>x</button>
                  <input
                    className="number-input setting-input setting-list__input"
                    type="number"
                    placeholder="Number"
                    value={skip}
                    onChange={(e) => updateSkipNumber(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <button
              className="setting-list__add"
              id="add-skip-number"
              onClick={() => addSkipNumber()}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="setting-category">
        <h2 className="setting-category__heading">Info</h2>

        <div className="setting">
          <a
            href="https://github.com/ntzm/osm-address-collector/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noreferrer"
          >
            Latest changes
          </a>
        </div>

        <div className="setting">
          <a
            href="https://github.com/ntzm/osm-address-collector"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>

        <div className="setting">
          <a
            href="https://github.com/ntzm/osm-address-collector/issues/new"
            target="_blank"
            rel="noreferrer"
          >
            Report a bug or request a feature
          </a>
        </div>
      </div>

      <div className="setting-category">
        <h2 className="setting-category__heading" onClick={showAdvancedHelp}>
          <span className="setting-category__info">ⓘ</span>
          Advanced
        </h2>

        <div className="setting">
          Heading provider {props.headingProvider ?? 'N/A'}:{' '}
          {props.heading === undefined ? 'N/A' : Math.round(props.heading)}
        </div>

        <div className="setting">
          <label htmlFor="overpass-timeout">
            Overpass timeout (milliseconds)
          </label>
          <input
            className="setting-input"
            type="number"
            id="overpass-timeout"
            value={overpassTimeout}
            onChange={(e) => setOverpassTimeout(Number(e.target.value))}
          />
        </div>

        <div className="setting">
          <label htmlFor="overpass-endpoint">Overpass endpoint</label>
          <input
            className="setting-input"
            type="text"
            id="overpass-endpoint"
            value={overpassEndpoint}
            onChange={(e) => setOverpassEndpoint(e.target.value)}
          />
        </div>

        <div className="setting">
          <button className="setting-button" id="reset-settings">
            Reset settings
          </button>
        </div>
      </div>
    </SettingsPopup>
  )
}
