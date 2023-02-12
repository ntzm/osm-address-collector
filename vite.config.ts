import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/osm-address-collector',
  plugins: [basicSsl(), react()],
  resolve: {
    alias: [
      {
        find: 'leaflet/dist/leaflet.css',
        replacement: 'leaflet/dist/leaflet.css',
      },
      {
        find: 'leaflet',
        replacement: 'leaflet/dist/leaflet-src.esm.js',
      },
    ],
  },
})
