import Head from 'next/head'

interface SEOHeadProps {
  title: string
  description: string
  image?: string
  storeTitle?: string
  url?: string
  structuredData?: object
  hasAdSenseScript?: boolean
}

const SEOHead = ({title, description, image, storeTitle, url, structuredData, hasAdSenseScript}: SEOHeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" title="description" content={description} />
      <meta name="viewport" title="viewport" content="width=device-width, initial-scale=1" />
      <meta name="format-detection" content="telephone=no,email=no,address=no" />
      {/* Open Graph meta tags for social media sharing */}
      <meta property="og:title" title="og:title" content={storeTitle || title} />
      <meta property="og:description" title="og:description" content={description} />
      <meta property="og:image" title="og:image" content={image} />
      <meta property="og:url" title="og:url" content={url} />
      <meta property="og:type" title="og:type" content="website" />
      {/* Twitter meta tags */}
      <meta name="twitter:card" title="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" title="twitter:title" content={storeTitle || title} />
      <meta name="twitter:description" title="twitter:description" content={description} />
      {image && <meta name="twitter:image" title="twitter:image" content={image} />}
      {url && <meta name="twitter:url" title="twitter:url" content={url} />}
      {/* Favicon and icons */}
      <link rel="icon" href="/_favicon.ico" title="favicon" />
      <link rel="icon" type="image/png" title="favicon-32x32" sizes="32x32" href="/v2favicon-32x32.png" />
      <link rel="icon" type="image/png" title="favicon-16x16" sizes="16x16" href="/v2favicon-16x16.png" />
      <link rel="apple-touch-icon" title="apple-touch-icon" sizes="180x180" href="/v2apple-touch-icon.png" />
      <link rel="canonical" title="canonical" href={url ? url : `${process.env.baseRouteProductionLink}`} />
      {/**
       * AdSense script is now handled globally in _document.tsx
       * Commenting out here to avoid duplicate scripts
       */}
      {/* <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5184444088968777"
        crossOrigin="anonymous"
      /> */}
      {structuredData && (
        <script
          key="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData || {}) // Fallback to empty object if undefined
          }}
        />
      )}
    </Head>
  )
}

export default SEOHead
