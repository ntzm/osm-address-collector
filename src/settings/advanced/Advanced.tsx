import { useBoundStore } from '../../store'
import SettingCategory from '../SettingCategory'

export default function Advanced() {
  const help = `Orientation is used to throw address nodes in the correct direction.
Orientation provider shows the method to get your device's orientation.
Orientation shows your device's current orientation.
We use Overpass API to find streets nearby to you.
You can customise the timeout and the endpoint here.
Do not change the endpoint unless you know what you are doing!`

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

  const headingProvider = useBoundStore((s) => s.headingProvider)
  const heading = useBoundStore((s) => s.heading)

  const reset = () => {
    if (
      !confirm(
        'Are you sure you want to reset the settings to the default values?',
      )
    ) {
      return
    }

    resetOverpassTimeout()
    resetOverpassEndpoint()
    resetStreetSearchDistance()
    resetThrowDistance()
    resetCustomTags()
    resetSkipNumbers()
  }

  return (
    <SettingCategory heading="Advanced" help={help}>
      <div className="setting">
        Heading provider {headingProvider ?? 'N/A'}:{' '}
        {heading === undefined ? 'N/A' : Math.round(heading)}
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
          onChange={(e) => updateOverpassTimeout(e.target.value)}
        />
      </div>

      <div className="setting">
        <label htmlFor="overpass-endpoint">Overpass endpoint</label>
        <input
          className="setting-input"
          type="text"
          id="overpass-endpoint"
          value={overpassEndpoint}
          onChange={(e) => updateOverpassEndpoint(e.target.value)}
        />
      </div>

      <div className="setting">
        <button className="setting-button" onClick={reset}>
          Reset settings
        </button>
      </div>
    </SettingCategory>
  )
}
