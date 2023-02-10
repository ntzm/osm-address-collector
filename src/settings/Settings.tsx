import SkipNumbers from './skip-numbers/SkipNumbers'
import CustomTags from './custom-tags/CustomTags'
import Street from './street/Street'
import General from './general/General'
import Advanced from './advanced/Advanced'
import { Accordion, Modal } from '@mantine/core'
import Info from './Info'

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
        <Advanced />
      </Accordion>
    </Modal>
  )
}
