import SkipNumbers from './skip-numbers/SkipNumbers'
import CustomTags from './custom-tags/CustomTags'
import Street from './street/Street'
import General from './general/General'
import Advanced from './advanced/Advanced'
import { Accordion } from '@mantine/core'
import Info from './Info'

export default function Settings() {
  return (
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
  )
}
