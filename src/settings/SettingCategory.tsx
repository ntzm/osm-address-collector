import { PropsWithChildren } from 'react'
import { Divider, Paper, Stack } from '@mantine/core'

export default function SettingCategory(props: PropsWithChildren) {
  return (
    <>
      <Paper p="md">
        <Stack align="self-start">{props.children}</Stack>
      </Paper>
      <Divider />
    </>
  )
}
