/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://myeki.market',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  additionalSitemaps: ['https://myeki.market/server-sitemap.xml'],
  additionalPaths: async config => {
    const result = []

    // Define base URL explicitly if env variable is not available
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://api.myeki.market/api/'

    // Add static pages
    result.push(
      {loc: '/', lastmod: new Date().toISOString()},
      {loc: '/contact-us', lastmod: new Date().toISOString()},
      {loc: '/privacy-policy', lastmod: new Date().toISOString()},
      {loc: '/terms-of-service', lastmod: new Date().toISOString()},
      {loc: '/home', lastmod: new Date().toISOString()},
      {loc: '/ads-gallery', lastmod: new Date().toISOString()},
      {loc: '/find-vendor', lastmod: new Date().toISOString()}
    )

    try {
      // Fetch both product and service categories
      const categoryTypes = ['product', 'service']

      for (const type of categoryTypes) {
        const params = new URLSearchParams({
          type: type
        })

        const response = await fetch(`${baseUrl}front/category?${params.toString()}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} for type: ${type}`)
        }

        const categoriesResponse = await response.json()

        // Check if the response has data array
        if (categoriesResponse.success && Array.isArray(categoriesResponse.data)) {
          categoriesResponse.data.forEach(category => {
            result.push({
              loc: `/category/${category.id}-${category.slug}?type=${category.type}`,
              lastmod: category.updated_at,
              priority: 0.7,
              changefreq: 'weekly'
            })
          })
        }
      }
    } catch (error) {
      console.error('Error fetching dynamic routes:', error)
      // Return static pages even if API call fails
      return result
    }

    return result
  },
  outDir: 'public'
}
