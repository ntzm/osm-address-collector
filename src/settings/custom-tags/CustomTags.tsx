import {
  Accordion,
  ActionIcon,
  Autocomplete,
  Badge,
  Button,
  Center,
  Grid,
  Input,
  Stack,
  TextInput,
} from '@mantine/core'
import { IconPlus, IconTags, IconX } from '@tabler/icons-react'
import { Fragment } from 'react'
import { useBoundStore } from '../../store'
import SettingCategory from '../SettingCategory'

export default function CustomTags() {
  const customTags = useBoundStore((s) => s.customTags)
  const addCustomTag = useBoundStore((s) => s.addCustomTag)
  const updateCustomTagKey = useBoundStore((s) => s.updateCustomTagKey)
  const updateCustomTagValue = useBoundStore((s) => s.updateCustomTagValue)
  const removeCustomTag = useBoundStore((s) => s.removeCustomTag)

  // todo make addable
  const tagKeys = [
    'addr:city',
    'addr:postcode',
    'addr:country',
    'addr:state',
    'addr:place',
    'addr:suburb',
    'addr:province',
    'addr:district',
    'addr:subdistrict',
    'addr:hamlet',
    'addr:village',
    'addr:town',
    'addr:county',
  ]

  return (
    <Accordion.Item value="custom-tags">
      <Accordion.Control icon={<IconTags />}>
        Custom Tags <Badge>{customTags.length}</Badge>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack spacing="xs">
          <Input.Description>
            Add custom tags to each address node from now on
          </Input.Description>
          <Grid gutter="xs" columns={13}>
            {customTags.map((customTag, i) => (
              <Fragment key={i}>
                <Grid.Col span={1}>
                  <ActionIcon
                    size="xs"
                    variant="filled"
                    onClick={() => removeCustomTag(i)}
                  >
                    <IconX />
                  </ActionIcon>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Autocomplete
                    data={tagKeys}
                    value={customTag.key}
                    onChange={(key) => updateCustomTagKey(i, key)}
                    autoCapitalize="none"
                    placeholder="Key"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    value={customTag.value}
                    onChange={(e) => updateCustomTagValue(i, e.target.value)}
                    placeholder="Value"
                  />
                </Grid.Col>
              </Fragment>
            ))}
          </Grid>
          <Button
            onClick={() => addCustomTag({ key: '', value: '' })}
            leftIcon={<IconPlus />}
          >
            Add
          </Button>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  )
}
