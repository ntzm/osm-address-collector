import { MultiSelect } from '@mantine/core'
import { useBoundStore } from '../../store'

export default function SkipNumbers() {
  const skipNumbers = useBoundStore((s) => s.skipNumbers)
  const updateSkipNumbers = useBoundStore((s) => s.updateSkipNumbers)

  return (
    <MultiSelect
      description="Define numbers to skip when guessing the next number in the sequence. For example, in the UK the number 13 is often skipped."
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
