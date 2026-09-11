/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    // antd & deps
    '@ant-design',
    '@rc-component',
    'antd',
    'rc-cascader',
    'rc-checkbox',
    'rc-collapse',
    'rc-dialog',
    'rc-drawer',
    'rc-dropdown',
    'rc-field-form',
    'rc-image',
    'rc-input',
    'rc-input-number',
    'rc-mentions',
    'rc-menu',
    'rc-motion',
    'rc-notification',
    'rc-pagination',
    'rc-picker',
    'rc-progress',
    'rc-rate',
    'rc-resize-observer',
    'rc-segmented',
    'rc-select',
    'rc-slider',
    'rc-steps',
    'rc-switch',
    'rc-table',
    'rc-tabs',
    'rc-textarea',
    'rc-tooltip',
    'rc-tree',
    'rc-tree-select',
    'rc-upload',
    'rc-util',
    'rc-virtual-list',
    'rc-virtualized',
    'rc-virtualized-select',
    'rc-virtualized-tree',
    'rc-wave',
  ],
  compress: true,
  env: {
    baseUrl: `${process.env.NEXT_PUBLIC_BASEURL}/api/`,
    baseRouteStagingLink: `${process.env.NEXT_PUBLIC_BASEURL_Link_Staging}`,
    baseRouteProductionLink: `${process.env.NEXT_PUBLIC_BASEURL_Link_Production}`,
    googleClientID: `${process.env.NEXT_PUBLIC_GOOGLE_ClIENT_ID}`,
    imageBaseUrl: `${process.env.NEXT_PUBLIC_IMAGE_FILE_BASEURL}`,
    mapBoxToken: `${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
    fileBaseUrl: `${process.env.NEXT_PUBLIC_IMAGE_FILE_BASEURL}`
  },
  images: {
    domains: [
      'localhost',
      'via.placeholder.com',
      'myeki.com',
      'teddyed.nyc3.cdn.digitaloceanspaces.com',
      'lh3.googleusercontent.com',
      'kuadratik.nyc3.digitaloceanspaces.com'
    ],
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60
  },
  // Modern webpack optimization
  webpack: (config, {dev, isServer}) => {
    // Only strip console in production
    if (!dev) {
      config.optimization.minimizer.forEach(minimizer => {
        if (minimizer.constructor.name === 'TerserPlugin') {
          minimizer.options.terserOptions.compress.drop_console = true
        }
      })
    }
    return config
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}

module.exports = nextConfig
