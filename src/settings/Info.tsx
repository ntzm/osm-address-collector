import {
  Accordion,
  ActionIcon,
  Anchor,
  Button,
  NavLink,
  Stack,
  Text,
} from '@mantine/core'
import {
  IconBrandGithub,
  IconBug,
  IconInfoCircle,
  IconStatusChange,
} from '@tabler/icons-react'

export default function Info() {
  return (
    <Accordion.Item value="info">
      <Accordion.Control icon={<IconInfoCircle />}>Info</Accordion.Control>
      <Accordion.Panel>
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
      </Accordion.Panel>
    </Accordion.Item>
  )
}
