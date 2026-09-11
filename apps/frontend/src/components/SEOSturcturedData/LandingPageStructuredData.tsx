export const LandingPageStructuredData = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'myEKI',
        description:
          'myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs...',
        url: 'https://myeki.market',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://myeki.market',
          name: 'myEKI'
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
        name: 'myEKI',
        url: 'https://myeki.market',
        logo: 'https://myeki.market/assets/WhiteLogo.svg', // Replace with actual logo URL
        description:
          'myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience.',
        sameAs: [
          // Add your social media profiles
          'https://www.facebook.com/myekimarket',
          'https://www.instagram.com/myekimarket/'
        ]
      },
      {
        '@type': 'WebPage',
        name: 'myEKI | Home',
        description:
          'myEKI is a local marketplace designed to connect small businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without extra costs. Join myEKI today and start selling for free! Find products and services near you!!',
        isPartOf: {
          '@type': 'WebSite',
          name: 'myEKI'
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          contentUrl: 'https://myeki.market/assets/myEKIHome.png'
        },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: [
            {
              '@type': 'Offer',
              name: 'Shop Now',
              description: 'Browse and shop from local vendors',
              url: 'https://myeki.market/'
            },
            {
              '@type': 'Offer',
              name: 'Start Selling',
              description: 'Create your store and start selling on myEKI',
              url: 'https://myeki.market/auth/sign-up?redirect=/mek/onboarding'
            }
          ]
        }
      }
    ]
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
}
