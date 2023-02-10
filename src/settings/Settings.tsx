import styled from 'styled-components'
import SkipNumbers from './skip-numbers/SkipNumbers'
import CustomTags from './custom-tags/CustomTags'
import Street from './street/Street'
import General from './general/General'
import SettingCategory from './SettingCategory'
import Advanced from './advanced/Advanced'
import { Accordion, Divider, Modal, Select, TextInput } from '@mantine/core'
import {
  IconNumbers,
  IconRoad,
  IconSettings,
  IconTags,
} from '@tabler/icons-react'

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
  isOpened: boolean
  onClose: () => void
}) {
  return (
    <Modal
      title="Settings"
      fullScreen
      opened={props.isOpened}
      onClose={props.onClose}
      padding="xs"
    >
      <Accordion
        defaultValue={['street', 'general', 'skip-numbers', 'custom-tags']}
        multiple
      >
        <Accordion.Item value="street">
          <Accordion.Control icon={<IconRoad />}>Street</Accordion.Control>
          <Accordion.Panel>
            <Street />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="general">
          <Accordion.Control icon={<IconSettings />}>General</Accordion.Control>
          <Accordion.Panel>
            <General />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="skip-numbers">
          <Accordion.Control icon={<IconNumbers />}>
            Skip Numbers
          </Accordion.Control>
          <Accordion.Panel>
            <SkipNumbers />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="custom-tags">
          <Accordion.Control icon={<IconTags />}>Custom Tags</Accordion.Control>
          <Accordion.Panel>
            <CustomTags />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Modal>
  )

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
