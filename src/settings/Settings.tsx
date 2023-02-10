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
import Info from './Info'

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
        defaultValue={[
          'street',
          'general',
          'skip-numbers',
          'custom-tags',
          'info',
        ]}
        multiple
      >
        <Street />
        <General />
        <SkipNumbers />
        <CustomTags />
        <Info />
      </Accordion>
    </Modal>
  )
}
