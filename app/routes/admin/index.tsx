import { redirect } from '@remix-run/node'

// https://remix.run/docs/en/v1/api/remix#redirect
// if (x) redirect('/schedule')

export default function AdminIndexRoute() {
  return <p>admin page</p>
}
