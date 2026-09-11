import Head from 'next/head'

interface SEOHeadProps {
  title: string
  description: string
  image?: string
  storeTitle?: string
  url?: string
}

const SEOHead = ({title, description, image, storeTitle, url}: SEOHeadProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" title="description" content={description} />
      <meta name="viewport" title="viewport" content="width=device-width, initial-scale=1" />

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
    </Head>
  )
}

export default SEOHead
