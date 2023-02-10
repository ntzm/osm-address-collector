import { Accordion, Input, Slider } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'
import { useBoundStore } from '../../store'

export default function General() {
  const throwDistance = useBoundStore((s) => s.throwDistance)
  const updateThrowDistance = useBoundStore((s) => s.updateThrowDistance)

  return (
    <Accordion.Item value="general">
      <Accordion.Control icon={<IconSettings />}>General</Accordion.Control>
      <Accordion.Panel>
        <Input.Wrapper>
          <Input.Label>Throw distance</Input.Label>
          <Input.Description>
            The distance that address nodes are thrown from your current
            position
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
      </Accordion.Panel>
    </Accordion.Item>
  )
}
