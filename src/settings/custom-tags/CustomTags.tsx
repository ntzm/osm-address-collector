import {
  ActionIcon,
  Autocomplete,
  Button,
  Center,
  Grid,
  TextInput,
} from '@mantine/core'
import { IconPlus, IconX } from '@tabler/icons-react'
import { useBoundStore } from '../../store'
import SettingCategory from '../SettingCategory'

export default function CustomTags() {
  const help = `Add custom OSM tags to each address node.
The tags you add will only be applied to addresses going forward.`

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
    <Grid gutter="xs" columns={13}>
      {customTags.map((customTag, i) => (
        <>
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
              size="xs"
              data={tagKeys}
              value={customTag.key}
              onChange={(key) => updateCustomTagKey(i, key)}
              autoCapitalize="none"
              placeholder="Key"
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              size="xs"
              value={customTag.value}
              onChange={(e) => updateCustomTagValue(i, e.target.value)}
              placeholder="Value"
            />
          </Grid.Col>
        </>
      ))}
      <Grid.Col span={12}>
        <Button
          onClick={() => addCustomTag({ key: '', value: '' })}
          leftIcon={<IconPlus />}
        >
          Add
        </Button>
      </Grid.Col>
    </Grid>
  )
}
