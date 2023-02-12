import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import analyze from 'rollup-plugin-analyzer'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/osm-address-collector',
  plugins: [basicSsl(), react()],
  build: {
    rollupOptions: {
      plugins: [analyze()],
    },
  },
})
