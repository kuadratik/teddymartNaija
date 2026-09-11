export const MallPageStructuredData = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'AfricanDiasporaMart Mall',
        url: 'https://myeki.market',
        description:
          'AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://myeki.market',
          name: 'AfricanDiasporaMart'
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://myeki.market/search?id={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'Organization',
        name: 'AfricanDiasporaMart',
        url: 'https://myeki.market',
        logo: 'https://myeki.market/assets/WhiteLogo.svg', // Replace with actual logo URL
        description:
          'AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community.',
        sameAs: [
          'https://www.facebook.com/myekimarket', // Replace with actual social media URLs
          'https://www.instagram.com/myekimarket/'
        ]
      },
      {
        '@type': 'WebPage',
        name: 'AfricanDiasporaMart | Mall',
        description:
          'AfricanDiasporaMart is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, AfricanDiasporaMart makes it easy for sellers to showcase their products or services and reach a wider audience. AfricanDiasporaMart empowers businesses to grow without extra costs. Join AfricanDiasporaMart today and start selling for free! Find products and services near you!!',
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
          '@type': 'Store',
          name: 'AfricanDiasporaMart Mall',
          description: 'Online marketplace for local businesses and vendors'
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
              description: 'Shop from local vendors in your community',
              url: 'https://myeki.market/'
            }
          ]
        }
      }
    ]
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
}
