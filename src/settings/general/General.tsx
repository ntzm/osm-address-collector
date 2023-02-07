import { useBoundStore } from '../../store'
import SettingCategory from '../SettingCategory'

export default function General() {
  const help = `Choose a distance to throw address nodes from your current position.
If you add an address node by pressing the left arrow key, it will throw the node to your left by this amount.`

  const throwDistance = useBoundStore((s) => s.throwDistance)
  const updateThrowDistance = useBoundStore((s) => s.updateThrowDistance)

  return (
    <SettingCategory heading="General" help={help}>
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
    </SettingCategory>
  )
}
