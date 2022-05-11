import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

export const loader: LoaderFunction = async () => {
  const x = true
  // const data = { message: 'hi' }
  if (x) return redirect('/login')
  return data
}

export default function AdminIndexRoute() {
  const data = useLoaderData()
  console.log({ data })
  return <p>admin page</p>
}
