import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/osm-address-collector',
  plugins: [
    basicSsl(),
    react(),
  ],
})
