import {ISelectedCategory} from '../Auth/Products/components/AllCategory'

interface IAdsGalleryStructuredDataProps {
  ads?: any[] // Your ads data
  categories?: ISelectedCategory[]
  totalAds?: number
}

export const AdsGalleryStructuredData = ({ads, categories, totalAds}: IAdsGalleryStructuredDataProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'myEKI | Ads Gallery',
        description:
          'myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community.',
        isPartOf: {
          '@type': 'WebSite',
          name: 'myEKI'
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://myeki.market'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Ads Gallery',
              item: 'https://myeki.market/ads-gallery'
            }
          ]
        }
      },
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://myeki.market/ads-gallery?search={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      },
      {
        '@type': 'ItemList',
        name: 'Classified Ads',
        numberOfItems: totalAds,
        itemListElement:
          ads?.map((ad: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: ad.title,
              description: ad.description,
              image:
                ad.media?.[0]?.type === 'image' ? `${process.env.imageBaseUrl}/${ad.media[0].file_path}` : undefined,
              offers: {
                '@type': 'Offer',
                price: ad.price,
                priceCurrency: ad.currency,
                availability: 'https://schema.org/InStock',
                url: `https://myeki.market/ads-gallery/${ad.id}`
              },
              category: ad.category?.name
            }
          })) || []
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I post an ad?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Click on the "Post Ad" button, fill in your ad details including title, description, price, and images, then submit your ad for review.'
            }
          },
          {
            '@type': 'Question',
            name: 'Is it free to post ads?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, posting classified ads on myEKI is completely free.'
            }
          }
        ]
      }
    ]
  }
}
