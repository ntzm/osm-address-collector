import { MultiSelect } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useBoundStore } from '../../store'
import SettingCategory from '../SettingCategory'

export default function SkipNumbers() {
  const help = `Choose some numbers to skip when the app tries to guess the next number in the sequence.
For example, in the UK the number 13 is often skipped.`

  const skipNumbers = useBoundStore((s) => s.skipNumbers)
  const updateSkipNumbers = useBoundStore((s) => s.updateSkipNumbers)

  return (
    <MultiSelect
      data={skipNumbers}
      value={skipNumbers}
      onChange={updateSkipNumbers}
      creatable
      searchable
      shouldCreate={(query) => /^\d+$/.test(query)}
      getCreateLabel={(query) => `Add ${query}`}
      rightSection={' '}
      rightSectionWidth={0}
      type="number"
    />
  )
}
