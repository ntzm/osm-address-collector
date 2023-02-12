import {
  ActionIcon,
  Autocomplete,
  Badge,
  Button,
  Group,
  Input,
  Stack,
  TextInput,
} from '@mantine/core'
import { IconEqual, IconPlus, IconTags, IconTrash } from '@tabler/icons-react'
import { useBoundStore } from '../../store'
import SettingCategory from '../SettingCategory'

// todo make addable
const TAG_KEYS = [
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

export default function CustomTags() {
  const customTags = useBoundStore((s) => s.customTags)
  const addCustomTag = useBoundStore((s) => s.addCustomTag)
  const updateCustomTagKey = useBoundStore((s) => s.updateCustomTagKey)
  const updateCustomTagValue = useBoundStore((s) => s.updateCustomTagValue)
  const removeCustomTag = useBoundStore((s) => s.removeCustomTag)

  return (
    <SettingCategory>
      <Group>
        <IconTags />
        Custom Tags
        <Badge>{customTags.length}</Badge>
      </Group>
      <Input.Description>
        Add custom tags to each address node from now on
      </Input.Description>
      <Stack spacing="xs" w="100%">
        {customTags.map((customTag, i) => (
          <Group grow spacing={0} key={i}>
            <Autocomplete
              data={TAG_KEYS}
              value={customTag.key}
              onChange={(key) => updateCustomTagKey(i, key)}
              autoCapitalize="none"
              placeholder="Key"
              rightSection={<IconEqual color="grey" />}
            />
            <TextInput
              value={customTag.value}
              onChange={(e) => updateCustomTagValue(i, e.target.value)}
              placeholder="Value"
              rightSection={
                <ActionIcon
                  size="xs"
                  variant="outline"
                  onClick={() => removeCustomTag(i)}
                  color="red"
                >
                  <IconTrash />
                </ActionIcon>
              }
            />
          </Group>
        ))}

        <Button
          onClick={() => addCustomTag({ key: '', value: '' })}
          leftIcon={<IconPlus />}
        >
          Add
        </Button>
      </Stack>
    </SettingCategory>
  )
}
