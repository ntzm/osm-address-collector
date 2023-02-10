import { Input, Slider } from '@mantine/core'
import { useBoundStore } from '../../store'
import SettingCategory from '../SettingCategory'

export default function General() {
  const help = `Choose a distance to throw address nodes from your current position.
If you add an address node by pressing the left arrow key, it will throw the node to your left by this amount.`

  const throwDistance = useBoundStore((s) => s.throwDistance)
  const updateThrowDistance = useBoundStore((s) => s.updateThrowDistance)

  return (
    <Input.Wrapper>
      <Input.Label>Throw distance</Input.Label>
      <Input.Description>
        The distance that address nodes are thrown from your current position
      </Input.Description>
      <Slider
        mt="xs"
        label={(value) => `${value} m`}
        min={1}
        max={100}
        value={throwDistance}
        onChange={updateThrowDistance}
      />
    </Input.Wrapper>
  )
}
