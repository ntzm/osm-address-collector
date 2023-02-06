import styled from "styled-components";
import { CustomTag } from "./types";

const SettingsPopup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  height: 100%;
  background: #fff;
  z-index: 5;
`

export default function Settings(props: {
  onClose: () => void,
  street: string,
  onStreetChange: (street: string) => void,
  streetSearchDistance: number,
  onStreetSearchDistanceChange: (streetSearchDistance: number) => void,
  customTags: CustomTag[],
  onCustomTagsChange: (customTags: CustomTag[]) => void,
  throwDistance: number,
  onThrowDistanceChange: (throwDistance: number) => void,
  skipNumbers: number[],
  onSkipNumbersChange: (skipNumbers: number[]) => void,
}) {
  const removeCustomTag = (i: number) => {
    props.onCustomTagsChange(
      props.customTags.filter((_, index) => i !== index)
    )
  }

  const addCustomTag = () => {
    props.onCustomTagsChange([
      ...props.customTags,
      { key: '', value : ''},
    ])
  }

  const onCustomTagKeyChange = (i: number, key: string) => {
    props.onCustomTagsChange(
      props.customTags.map((customTag, index) => {
        if (i === index) {
          return { ...customTag, key }
        }

        return customTag
      })
    )
  }

  const onCustomTagValueChange = (i: number, value: string) => {
    props.onCustomTagsChange(
      props.customTags.map((customTag, index) => {
        if (i === index) {
          return { ...customTag, value }
        }

        return customTag
      })
    )
  }

  const removeSkipNumber = (i: number) => {
    props.onSkipNumbersChange(
      props.skipNumbers.filter((_, index) => i !== index)
    )
  }

  const addSkipNumber = () => {
    props.onSkipNumbersChange([
      ...props.skipNumbers,
      0,
    ])
  }

  const onSkipNumberChange = (i: number, value: number) => {
    props.onSkipNumbersChange(
      props.skipNumbers.map((n, index) => {
        if (i === index) {
          return value
        }

        return n
      })
    )
  }

  return <SettingsPopup>
    <button onClick={() => props.onClose()}>x</button>

    <div className="setting-category">
      <h2 className="setting-category__heading" id="setting-street">
        <span className="setting-category__info">ⓘ</span>
        Street
      </h2>

      <datalist id="streets">
      </datalist>

      <div className="setting">
        <input
          className="setting-input"
          type="text"
          id="street"
          list="streets"
          placeholder="Street"
          autoComplete="off"
          value={props.street}
          onChange={(e) => props.onStreetChange(e.target.value)}
        />
      </div>

      <div className="setting">
        <button className="setting-button" id="update-streets">Get streets</button>
        <span className="status" id="update-streets-status">No streets</span>
        <p className="disclaimer">Street data from <a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a></p>
      </div>

      <div className="setting">
        <label htmlFor="street-search-distance">Street search distance: {props.streetSearchDistance}m</label>
        <br />
        <input
          className="setting-input"
          type="range"
          id="street-search-distance"
          min="0"
          max="50"
          value={props.streetSearchDistance}
          onChange={(e) => props.onStreetSearchDistanceChange(Number(e.target.value))}
        />
      </div>
    </div>

    <div className="setting-category">
      <h2 className="setting-category__heading" id="setting-custom-tags">
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
            {props.customTags.map((customTag, i) => <div key={i} className="custom-tag setting-list__row">
              <button onClick={() => removeCustomTag(i)}>x</button>
              <input className="key-input setting-input setting-list__input" type="text" placeholder="Key" autoCapitalize="none" list="tag-keys" value={customTag.key} onChange={(e) => onCustomTagKeyChange(i, e.target.value)} />
              <input className="value-input setting-input setting-list__input" type="text" placeholder="Value" value={customTag.value} onChange={(e) => onCustomTagValueChange(i, e.target.value)} />
            </div>)}
          </div>
          <button className="setting-list__add" id="add-custom-tag" onClick={addCustomTag}>+</button>
        </div>
      </div>
    </div>

    <div className="setting-category">
      <h2 className="setting-category__heading" id="setting-general">
        <span className="setting-category__info">ⓘ</span>
        General
      </h2>

      <div className="setting">
        <label htmlFor="distance">Throw distance: {props.throwDistance}m</label>
        <input className="setting-input" type="range" id="distance" min="1" max="100" value={props.throwDistance} onChange={e => props.onThrowDistanceChange(Number(e.target.value))} />
      </div>
    </div>

    <div className="setting-category">
      <h2 className="setting-category__heading" id="setting-skip-numbers">
        <span className="setting-category__info">ⓘ</span>
        Skip numbers
      </h2>

      <div className="setting">
        <div className="setting-list">
          <div id="skip-numbers">
            {props.skipNumbers.map((skip, i) => <div key={i} className="skip-number setting-list__row">
              <button onClick={() => removeSkipNumber(i)}>x</button>
              <input className="number-input setting-input setting-list__input" type="number" placeholder="Number" value={skip} onChange={(e) => onSkipNumberChange(i, Number(e.target.value))} />
            </div>)}
          </div>
          <button className="setting-list__add" id="add-skip-number" onClick={addSkipNumber}>+</button>
        </div>
      </div>
    </div>

    <div className="setting-category">
      <h2 className="setting-category__heading">Info</h2>

      <div className="setting">
        <a href="https://github.com/ntzm/osm-address-collector/blob/main/CHANGELOG.md" target="_blank">Latest changes</a>
      </div>

      <div className="setting">
        <a href="https://github.com/ntzm/osm-address-collector" target="_blank">GitHub</a>
      </div>

      <div className="setting">
        <a href="https://github.com/ntzm/osm-address-collector/issues/new" target="_blank">Report a bug or request a feature</a>
      </div>
    </div>

    <div className="setting-category">
      <h2 className="setting-category__heading" id="setting-advanced">
        <span className="setting-category__info">ⓘ</span>
        Advanced
      </h2>

      <div className="setting">
        Orientation provider: <span id="orientation-provider">None</span>
      </div>

      <div className="setting">
        Orientation: <span id="orientation">N/A</span>
      </div>

      <div className="setting">
        <label htmlFor="overpass-timeout">Overpass timeout (milliseconds)</label>
        <input className="setting-input" type="number" id="overpass-timeout" />
      </div>

      <div className="setting">
        <label htmlFor="overpass-endpoint">Overpass endpoint</label>
        <input className="setting-input" type="text" id="overpass-endpoint" />
      </div>

      <div className="setting">
        <button className="setting-button" id="reset-settings">Reset settings</button>
      </div>

      <div className="setting">
        <button className="setting-button" id="show-logs">Update logs</button>
        <textarea className="setting-input" id="logs" readOnly></textarea>
      </div>
    </div>
  </SettingsPopup>
}