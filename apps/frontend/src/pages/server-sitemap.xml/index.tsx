import axios from 'axios'
import {getServerSideSitemap} from 'next-sitemap'

export const getServerSideProps = async (ctx: any) => {
  try {
    // Define all possible types
    const types = ['product', 'service'] // Add all your possible types here

    let sitemapEntries = [
      {
        loc: process.env.baseUrl,
        lastmod: new Date().toISOString()
      }
    ]

    // Fetch categories for each type
    for (const type of types) {
      const res = await axios.get(`${process.env.baseUrl}/front/category?type=${type}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })

      const {data} = res.data

      // Add entries for this type
      sitemapEntries = [
        ...sitemapEntries,
        ...data.map((category: any) => ({
          loc: `https://myeki.market/category/${category?.id}`,
          lastmod: category.updated_at
        }))
      ]
    }

    return getServerSideSitemap(ctx, sitemapEntries)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return getServerSideSitemap(ctx, [
      {
        loc: process.env.baseUrl,
        lastmod: new Date().toISOString()
      }
    ])
  }
}

// Default export to prevent next.js errors
const Sitemap = () => null
export default Sitemap
