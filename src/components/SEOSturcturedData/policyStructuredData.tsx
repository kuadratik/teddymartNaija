// Contact Page structured data
export const ContactPageStructuredData = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us',
    description: 'Get in touch with myEKI Market',
    mainEntity: {
      '@type': 'Organization',
      name: 'myEKI Market',
      isPartOf: {
        '@type': 'WebSite',
        name: 'myEKI'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        // telephone: '+1-xxx-xxx-xxxx',
        contactType: 'customer service',
        email: 'inquiries@myeki.market',
        areaServed: 'Worldwide',
        availableLanguage: ['English']
      }
    }
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
}

// About Us Page structured data
// const AboutPageStructuredData = () => {
//   const schema = {
//     '@context': 'https://schema.org',
//     '@type': 'AboutPage',
//     name: 'About myEKI Market',
//     description: 'Learn more about myEKI Market and our mission',
//     mainEntity: {
//       '@type': 'Organization',
//       name: 'myEKI Market',
//       description: 'Your company description here',
//       foundingDate: '2023', // Replace with actual founding date
//       sameAs: [
//         // Add your social media profiles
//         'https://facebook.com/myeki',
//         'https://twitter.com/myeki',
//         'https://linkedin.com/company/myeki'
//       ]
//     }
//   }

//   return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
// }

// FAQ Page structured data
// const FAQPageStructuredData = () => {
//   const schema = {
//     '@context': 'https://schema.org',
//     '@type': 'FAQPage',
//     mainEntity: [
//       {
//         '@type': 'Question',
//         name: 'How do I create a store?',
//         acceptedAnswer: {
//           '@type': 'Answer',
//           text: 'You can create a store by signing up and following our simple onboarding process.'
//         }
//       },
//       {
//         '@type': 'Question',
//         name: 'What payment methods do you accept?',
//         acceptedAnswer: {
//           '@type': 'Answer',
//           text: 'We accept credit cards, PayPal, and bank transfers.'
//         }
//       }
//       // Add more FAQ items as needed
//     ]
//   }

//   return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
// }

// Privacy Policy or Terms of Service Page
export const PrivacyPageStructuredData = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy',
    isPartOf: {
      '@type': 'WebSite',
      name: 'myEKI'
    },
    description:
      'Kuadratik Inc. ("we," "our," "us") values your privacy and is committed to protecting your personal information. This Privacy Policy outlines the types of data we collect from users of the myeki.market platform (the "Service"), how we use and protect that data, and your rights regarding your personal information...',
    mainEntity: {
      '@type': 'WebPageElement',
      text: 'This privacy policy describes how we collect and use your information...'
    }
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
}
export const TermsPageStructuredData = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Privacy Policy',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://myeki.market',
      name: 'myEKI'
    },
    description:
      'These Terms of Service ("Terms") govern your use of the myeki.market platform ("Service"), operated by Kuadratik Inc. ("we," "our," "us"). By accessing or using our Services, you agree to comply with these Terms. If you do not agree, you may not use our Services...',
    mainEntity: {
      '@type': 'WebPageElement',
      text: 'This terms of service outlines the terms and conditions...'
    }
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(schema)}} />
}
