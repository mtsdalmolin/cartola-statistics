/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.sde.globo.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 's2-cartola.glbimg.com',
        pathname: '**'
      }
    ]
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
