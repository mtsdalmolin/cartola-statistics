/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.sde.globo.com',
        port: '',
        pathname: '*',
      },
    ],
  },
}

module.exports = nextConfig
