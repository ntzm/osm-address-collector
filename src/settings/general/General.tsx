import {
  Box,
  Center,
  ColorScheme,
  Group,
  Input,
  SegmentedControl,
  Slider,
} from '@mantine/core'
import { IconMoon, IconSettings, IconSun } from '@tabler/icons-react'
import { useBoundStore } from '../../store'
import SettingCategory from '../SettingCategory'

export default function General() {
  const throwDistance = useBoundStore((s) => s.throwDistance)
  const updateThrowDistance = useBoundStore((s) => s.updateThrowDistance)

  const theme = useBoundStore((s) => s.theme)
  const updateTheme = useBoundStore((s) => s.updateTheme)

  return (
    <SettingCategory>
      <Group>
        <IconSettings />
        General
      </Group>
      <Input.Wrapper w="100%">
        <Input.Label>Throw distance</Input.Label>
        <Input.Description>
          The distance that address nodes are thrown from your current position
        </Input.Description>
        <Slider
          mt="xs"
          mb="lg"
          label={(value) => `${value}m`}
          min={1}
          max={50}
          value={throwDistance}
          onChange={updateThrowDistance}
          marks={[10, 20, 30, 40].map((n) => ({
            value: n,
            label: `${n}m`,
          }))}
        />
      </Input.Wrapper>
      <Input.Label>Theme</Input.Label>
      <SegmentedControl
        value={theme}
        onChange={(value: ColorScheme) => updateTheme(value)}
        data={[
          {
            value: 'light',
            label: (
              <Center>
                <IconSun size={16} stroke={1.5} />
                <Box ml={10}>Light</Box>
              </Center>
            ),
          },
          {
            value: 'dark',
            label: (
              <Center>
                <IconMoon size={16} stroke={1.5} />
                <Box ml={10}>Dark</Box>
              </Center>
            ),
          },
        ]}
      />
    </SettingCategory>
  )
}
