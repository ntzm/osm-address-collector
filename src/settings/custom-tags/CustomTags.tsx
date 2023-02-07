import { useBoundStore } from '../../store'
import SettingCategory from '../SettingCategory'

export default function CustomTags() {
  const help = `Add custom OSM tags to each address node.
The tags you add will only be applied to addresses going forward.`

  const customTags = useBoundStore((s) => s.customTags)
  const addCustomTag = useBoundStore((s) => s.addCustomTag)
  const updateCustomTagKey = useBoundStore((s) => s.updateCustomTagKey)
  const updateCustomTagValue = useBoundStore((s) => s.updateCustomTagValue)
  const removeCustomTag = useBoundStore((s) => s.removeCustomTag)

  return (
    <SettingCategory heading="Custom tags" help={help}>
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
    </SettingCategory>
  )
}
