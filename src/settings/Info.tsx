import { Group, NavLink, Stack } from '@mantine/core'
import {
  IconBrandGithub,
  IconBug,
  IconInfoCircle,
  IconStatusChange,
} from '@tabler/icons-react'
import SettingCategory from './SettingCategory'

export default function Info() {
  return (
    <SettingCategory>
      <Group>
        <IconInfoCircle />
        Info
      </Group>
      <Stack spacing={0} w="100%">
        <NavLink
          px={0}
          component="a"
          href="https://github.com/ntzm/osm-address-collector/blob/main/CHANGELOG.md"
          target="_blank"
          rel="noreferrer"
          icon={<IconStatusChange />}
          label="Latest changes"
        />
        <NavLink
          px={0}
          component="a"
          href="https://github.com/ntzm/osm-address-collector"
          target="_blank"
          rel="noreferrer"
          icon={<IconBrandGithub />}
          label="GitHub"
        />
        <NavLink
          px={0}
          component="a"
          href="https://github.com/ntzm/osm-address-collector/issues/new"
          target="_blank"
          rel="noreferrer"
          icon={<IconBug />}
          label="Report a bug or request a feature"
        />
      </Stack>
    </SettingCategory>
  )
}
