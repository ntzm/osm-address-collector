import basicSsl from '@vitejs/plugin-basic-ssl'

const config = {
  base: '/osm-address-collector',
  plugins: [
    basicSsl(),
  ],
}

export default config
