import { MantineProvider } from '@mantine/core'
import App from './App'
import { useBoundStore } from './store'

export default function Mantine() {
  const theme = useBoundStore((s) => s.theme)

  return (
    <MantineProvider
      theme={{ colorScheme: theme }}
      withGlobalStyles
      withNormalizeCSS
    >
      <App />
    </MantineProvider>
  )
}
