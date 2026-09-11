import LandingPage from '@/components/Auth/Products'
import CustomerLayout from '@/components/Layout/Customerlayout'
import {MallPageStructuredData} from '@/components/SEOSturcturedData/MallPageStructuredData'
import SEOHead from '@/components/SharedUI/SEOHead'
import {capitalizeOnlyFirstLetter} from '@/utils/fx'
import axios from 'axios'
import {GetStaticProps} from 'next'
import {parseCookies} from 'nookies'
function getClipUid() {
  if (typeof window !== 'undefined') {
    const clipUid = localStorage.getItem('Clip-Uid')
    if (clipUid) {
      return clipUid
    }
  }
  return null
}

function getAuthToken() {
  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('authToken')
    if (authToken) {
      return authToken
    }
  }
  return null
}
const HomePage = () => {
  return (
    <div>
      <SEOHead
        title={`AfricanDiasporaMart | Mall`}
        description="AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!"
      />
      <MallPageStructuredData />
      <main className="">
        <LandingPage />
      </main>
    </div>
  )
}

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <CustomerLayout className="px-0" maxWidth={false} landingBool={false}>
      {page}
    </CustomerLayout>
  )
}

export const getStaticProps: GetStaticProps = async (context: any) => {
  const cookies = parseCookies(context)
  const clipUid = cookies['Clip-Uid'] || ''
  const authToken = cookies['authToken'] || ''

  try {
    const types = ['product', 'service']
    const categoryUrls = types.map(type => `${process.env.baseUrl}front/category?type=${type}`)

    const categoryResponses = await Promise.all(
      categoryUrls.map(url =>
        axios.get(url, {
          headers: {
            Authorization: authToken || '',
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'clip-uid': clipUid
          }
        })
      )
    )

    const categories = categoryResponses.flatMap(res => res.data.data || [])

    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: 'AfricanDiasporaMart Mall',
          url: 'https://myeki.market',
          description:
            'AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community.', // Your description
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://myeki.market/search?id={search_term_string}', // Corrected target
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'Organization',
          name: 'AfricanDiasporaMart',
          url: 'https://myeki.market',
          logo: 'https://myeki.market/assets/WhiteLogo.svg', // Your logo URL
          description: 'AfricanDiasporaMart is a local marketplace...', // Your description
          sameAs: [
            'https://www.facebook.com/myekimarket', // Your social media URLs
            'https://www.instagram.com/myekimarket/'
          ]
        },
        {
          '@type': 'WebPage',
          name: 'AfricanDiasporaMart | Mall',
          description: 'AfricanDiasporaMart is a local marketplace...', // Your description
          isPartOf: {
            '@type': 'WebSite',
            name: 'AfricanDiasporaMart Mall'
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Mall',
                item: 'https://myeki.market'
              }
            ]
          },
          mainEntity: {
            '@type': 'CollectionPage',
            name: 'Products and Services',
            description: 'Browse our categories',
            hasPart: categories.map((category, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'ProductGroup',
                name: category.name,
                url: `https://myeki.market/category/${category.id}-${(category as any).slug}?type=${(category as any).type}`,
                description:
                  category.description ||
                  `Browse ${capitalizeOnlyFirstLetter(category.type)}s in ${category.name} category`,
                image: category.image
                  ? `https://myeki.market/${category.image}`
                  : 'https://myeki.market/assets/myEKIHome.png',
                hasVariant: {
                  // This is the key to solving the variant issue
                  '@type': 'Product', // Or "Service" if applicable
                  name: category.name + ' Group', // Give it a unique name
                  image: category.image
                    ? `https://myeki.market/${category.image}`
                    : 'https://myeki.market/assets/myEKIHome.png',
                  url: `https://myeki.market/category/${category.id}-${(category as any).slug}?type=${(category as any).type}`, // Same URL as the group
                  description:
                    category.description || `${capitalizeOnlyFirstLetter(category.type)}s related to ${category.name}`,
                  sku: category.id + `-${category.slug}`, // A unique identifier (use category ID if nothing else is available)
                  offers: {
                    // Provide a default offer
                    '@type': 'Offer',
                    priceCurrency: 'USD', // Or your currency
                    price: '0', // Or a suitable default price
                    availability: 'https://schema.org/InStock' // Or other availability
                  }
                }
              }
            }))
          },
          offers: {
            '@type': 'AggregateOffer',
            name: 'Marketplace Services',
            offers: [
              {
                '@type': 'Offer',
                name: 'Free Store Creation',
                description: 'Create your online store for free',
                url: 'https://myeki.market/auth/sign-up?redirect=/mek/onboarding'
              },
              {
                '@type': 'Offer',
                name: 'Local Shopping',
                description: 'Shop from local vendors',
                url: 'https://myeki.market/'
              }
            ]
          }
        }
      ]
    }

    return {
      props: {
        structuredData,
        categories
      },
      revalidate: 600 // Optional: for ISR
    }
  } catch (error) {
    console.error('Error fetching category data:', error)
    return {
      props: {
        structuredData: null, // Or {}
        categories: []
      }
    }
  }
}

export default HomePage
