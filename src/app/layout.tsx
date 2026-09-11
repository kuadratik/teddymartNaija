import '@/styles/globals.css'
import {GoogleTagManager} from '@next/third-parties/google'
import type {Metadata} from 'next'
import Script from 'next/script'
import 'quill/dist/quill.snow.css'
import {ReactNode} from 'react'
import 'react-phone-input-2/lib/style.css'
import 'swiper/css'
import {Providers} from './providers'

export const metadata: Metadata = {
  title: 'myEKI - Marketplace',
  description:
    'myEKI is a local and global e-commerce marketplace designed to connect small, medium and large businesses and vendors with customers in their community. Offering free storefronts with unique URLs, myEKI makes it easy for sellers to showcase their products or services and reach a wider audience. myEKI empowers businesses to grow without any extra costs. Join myEKI today and start selling for free! Find products and services near you!!',
  verification: {
    google: 'sjxJHaHM06C1ibo8nwpN4aBypWEa6lPWW_C0xhA5CpM'
  },
  icons: {
    icon: [
      {url: '/_favicon.ico', type: 'image/x-icon'},
      {url: '/v2favicon-32x32.png', sizes: '32x32', type: 'image/png'},
      {url: '/v2favicon-16x16.png', sizes: '16x16', type: 'image/png'}
    ],
    apple: [{url: '/v2apple-touch-icon.png', sizes: '180x180', type: 'image/png'}]
  },
  openGraph: {
    title: 'myEKI - Marketplace',
    description:
      'myEKI is a local and global e-commerce marketplace designed to connect small, medium and large businesses and vendors with customers in their community.',
    images: ['/assets/myEKIHome.png'],
    type: 'website'
  }
}

export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16718741843" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5184444088968777"
          crossOrigin="anonymous"
        />
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
      </head>
      <body>
        <GoogleTagManager gtmId="GTM-MM3TLHHQ" />
        <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" async />
        <Script src="https://cdn.headwayapp.co/widget.js" strategy="beforeInteractive" />
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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
