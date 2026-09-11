import {createCache, extractStyle, StyleProvider} from '@ant-design/cssinjs'
import type {DocumentContext} from 'next/document'
import Document, {Head, Html, Main, NextScript} from 'next/document'
import Script from 'next/script'

const MyDocument = () => (
  <Html lang="en">
    <Head>
      <meta name="google-site-verification" content="sjxJHaHM06C1ibo8nwpN4aBypWEa6lPWW_C0xhA5CpM" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
        rel="stylesheet"
      />
      <link rel="icon" href="/_favicon.ico" title="favicon" />
      <link rel="icon" type="image/png" title="favicon-32x32" sizes="32x32" href="/v2favicon-32x32.png" />
      <link rel="icon" type="image/png" title="favicon-16x16" sizes="16x16" href="/v2favicon-16x16.png" />
      <link rel="apple-touch-icon" title="apple-touch-icon" sizes="180x180" href="/v2apple-touch-icon.png" />
      <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16718741843" />
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5184444088968777"
        crossOrigin="anonymous"
      ></script>
      {process.env.NODE_ENV === 'development' && (
        <script crossOrigin="anonymous" src="https://unpkg.com/react-scan/dist/auto.global.js" />
      )}
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "tpnqy90bw2");
          `
        }}
      />
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
