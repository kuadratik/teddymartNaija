import {createCache, extractStyle, StyleProvider} from '@ant-design/cssinjs'
import type {DocumentContext} from 'next/document'
import Document, {Head, Html, Main, NextScript} from 'next/document'
import Script from 'next/script'

const MyDocument = () => (
  <Html lang="en">
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      <link rel="icon" href="/_favicon.ico" title="favicon" />
      <link rel="icon" type="image/png" title="favicon-32x32" sizes="32x32" href="/v2favicon-32x32.png" />
      <link rel="icon" type="image/png" title="favicon-16x16" sizes="16x16" href="/v2favicon-16x16.png" />
      <link rel="apple-touch-icon" title="apple-touch-icon" sizes="180x180" href="/v2apple-touch-icon.png" />
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16718741843" />
      {/* <script src="https://accounts.google.com/gsi/client" async defer></script> */}
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>

    <Script
      id="google-analytics"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'AW-16718741843');
              `
      }}
    />
  </Html>
)

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache()
  const originalRenderPage = ctx.renderPage
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => (
        <StyleProvider cache={cache}>
          <App {...props} />
        </StyleProvider>
      )
    })

  const initialProps = await Document.getInitialProps(ctx)
  const style = extractStyle(cache, true)
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{__html: style}} />
      </>
    )
  }
}

export default MyDocument
