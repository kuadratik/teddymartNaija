interface IProps {
  category: any
  product: any
}

export const CategoryStructuredData = ({category, product}: IProps) => {
  const products = product.filter((val: any) => val?.category_id === category?.id)

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: `${category?.name} Collection`,
        description: category?.description,
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://myeki.market',
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
              name: category?.name,
              item: `https://myeki.market/category/${category?.id}-${category?.slug}?type=${category?.type}`
            }
          ]
        },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement:
            products?.map((product: any, index: number) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Product',
                name: product?.name,
                description: product?.description,
                image: `${process.env.imageBaseUrl}/${product?.images[0] || '/assets/default_banner.jpg'}`,
                sku: product?.id,
                offers: {
                  '@type': 'Offer',
                  price: product?.display_price || 0,
                  priceCurrency: product?.currency,
                  availability: product?.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
                }
                // aggregateRating: {
                //   '@type': 'AggregateRating',
                //   ratingValue: '3.5',
                //   reviewCount: '11'
                // }
              }
            })) || []
        }
      },
      {
        '@type': 'WebPage',
        name: 'MEK Directory | myEKI',
        description: 'Find products and services near you!! Get Listed on myEKI and start selling for free!',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://myeki.market',
          name: 'myEKI'
        }
      }
    ]
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
}
