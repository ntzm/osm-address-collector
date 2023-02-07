import { useBoundStore } from '../../store'
import SettingCategory from '../SettingCategory'

export default function SkipNumbers() {
  const help = `Choose some numbers to skip when the app tries to guess the next number in the sequence.
For example, in the UK the number 13 is often skipped.`

  const skipNumbers = useBoundStore((s) => s.skipNumbers)
  const addSkipNumber = useBoundStore((s) => s.addSkipNumber)
  const updateSkipNumber = useBoundStore((s) => s.updateSkipNumber)
  const removeSkipNumber = useBoundStore((s) => s.removeSkipNumber)

  return (
    <SettingCategory heading="Skip numbers" help={help}>
      <div className="setting">
        <div className="setting-list">
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
          <button
            className="setting-list__add"
            id="add-skip-number"
            onClick={() => addSkipNumber()}
          >
            +
          </button>
        </div>
      </div>
    </SettingCategory>
  )
}
