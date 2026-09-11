/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
      'teddyed.nyc3.cdn.digitaloceanspaces.com',
      'lh3.googleusercontent.com',
      'kuadratik.nyc3.digitaloceanspaces.com'
    ],
    unoptimized: true
  }
}

module.exports = nextConfig
