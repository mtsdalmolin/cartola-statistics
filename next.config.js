/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['s.sde.globo.com']
  },
  swcMinify: false,
  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
      preventFullImport: true,
    }
  }
}

module.exports = nextConfig
