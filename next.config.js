/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['postgres']
  },
  images: {
    domains: ['localhost', 'vercel.app']
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  // Vercel deployment optimizations
  output: 'standalone',
  poweredByHeader: false,
  compress: true
}

module.exports = nextConfig
