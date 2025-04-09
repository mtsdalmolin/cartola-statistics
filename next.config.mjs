import ReactComponentName from 'react-scan/dist/react-component-name/webpack'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.plugins.push(ReactComponentName.default({})); 
    return config;
  },
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
      },
      {
        protocol: 'https',
        hostname: 's2.glbimg.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 's3.glbimg.com',
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

export default nextConfig
