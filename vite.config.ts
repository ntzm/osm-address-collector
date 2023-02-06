import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'

const config = {
  base: '/osm-address-collector',
  plugins: [
    basicSsl(),
    react(),
  ],
}

export default config
