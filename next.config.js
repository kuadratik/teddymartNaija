/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    baseUrl: `${process.env.NEXT_PUBLIC_BASEURL}/api/`,
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
