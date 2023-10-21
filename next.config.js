/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true
  },
  images: {
    domains: ['s.sde.globo.com', 's2-cartola.glbimg.com']
  },
  swcMinify: false,
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
      preventFullImport: true
    }
  }
}

module.exports = nextConfig
