import styled from 'styled-components'
import SkipNumbers from './skip-numbers/SkipNumbers'
import CustomTags from './custom-tags/CustomTags'
import Street from './street/Street'
import General from './general/General'
import SettingCategory from './SettingCategory'
import Advanced from './advanced/Advanced'

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

export default function Settings(props: { onClose: () => void }) {
  return (
    <SettingsPopup>
      <button onClick={() => props.onClose()}>x</button>

      <Street />
      <General />
      <SkipNumbers />
      <CustomTags />

      <SettingCategory heading="Info">
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
      </SettingCategory>

      <Advanced />
    </SettingsPopup>
  )
}