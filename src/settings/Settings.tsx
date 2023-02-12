import SkipNumbers from './skip-numbers/SkipNumbers'
import CustomTags from './custom-tags/CustomTags'
import Street from './street/Street'
import General from './general/General'
import Advanced from './advanced/Advanced'
import Info from './Info'

export default function Settings() {
  return (
    <>
      <Street />
      <General />
      <SkipNumbers />
      <CustomTags />
      <Info />
      <Advanced />
    </>
  )
}
