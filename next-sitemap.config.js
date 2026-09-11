/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://myeki.market',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  additionalSitemaps: ['https://myeki.market/server-sitemap.xml'], // Changed this
  additionalPaths: async config => {
    const result = []

    // Add static pages
    result.push(
      {loc: '/contact-us', lastmod: new Date().toISOString()},
      {loc: '/privacy-policy', lastmod: new Date().toISOString()},
      {loc: '/terms-of-service', lastmod: new Date().toISOString()}
    )

    // You can add more dynamic content here if needed
    // For example, fetching products or services and adding them to the result array

    return result
  },
  // This will create the server-sitemap.xml file
  outDir: 'public'
}
