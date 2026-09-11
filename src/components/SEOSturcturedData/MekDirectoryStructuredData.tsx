interface IProps {
  industries: any
  selectedCategories: any
  search: string
}

export const MekDirectoryStructuredData = ({industries, selectedCategories, search}: IProps) => {
  console.log('🚀 ~ MekDirectoryStructuredData ~ industries:', industries?.data?.data)
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'MEK Directory | myEKI',
        description: 'Find products and services near you!! Get Listed on myEKI and start selling for free!',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://myeki.market',
          name: 'myEKI'
        }
      },
      {
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
            name: 'MEK Directory',
            item: 'https://myeki.market/mek-directory'
          }
        ]
      },
      {
        '@type': 'Directory',
        name: 'MEK Business Directory',
        description: 'Business directory listing on myEKI marketplace',
        hasOfferCatalog: {
          '@type': 'LocalBusiness',
          name: 'Industry Categories',
          itemListElement:
            industries?.data?.data?.map((industry: any) => ({
              '@type': 'OfferCatalog',
              name: industry.business_name,
              description: industry.business_description || `Browse ${industry.business_name} businesses`,
              industryName: industry?.industry?.name,
              url: `https://myeki.market/mek-directory/${industry?.business_slug}`,
              image: `${process.env.imageBaseUrl}/${industry?.business_logo_url || '/assets/default_banner.jpg'}`,
              address: {
                '@type': 'PostalAddress',
                streetAddress: industry.business_address,
                addressState: industry.state || 'NA',
                addressCountry: industry.country || 'NA'
              },
              // Add additional business information if available
              telephone: industry.business_phone,
              email: industry.business_email || 'NA',
              owner: industry.owner_role
            })) || []
        }
      },
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://myeki.market/mek-directory?search={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    ]
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
}
