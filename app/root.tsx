import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'

import globalStylesUrl from '~/styles/global.css'
import Footer from './components/Footer'
import Header from './components/Header'
import ScrollUp from './components/ScrollUp'

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: globalStylesUrl,
  },
]

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'XFSL',
  viewport: 'width=device-width,initial-scale=1',
})

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {process.env.NODE_ENV !== "development" && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=G-SFQRLSW05W`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-SFQRLSW05W', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
          </>
        )}
        <Header />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Footer />
        <ScrollUp />
      </body>
    </html>
  )
}
