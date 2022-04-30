import type { LinksFunction, MetaFunction } from '@remix-run/node'
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'

import globalStylesUrl from '~/styles/global.css'
import Footer from './components/Footer'
import Header from './components/Header'

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
        <Header />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Footer />
      </body>
    </html>
  )
}
