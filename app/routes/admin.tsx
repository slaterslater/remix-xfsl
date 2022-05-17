import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node'
import { json, Response, redirect } from '@remix-run/node'
import { Form, Link, Outlet, useActionData, useLoaderData, useSubmit } from '@remix-run/react'
import { getUserId, requireUserId } from '~/utils/session.server'

import { db } from '~/utils/db.server'
import { dateFormat } from '~/lib/datetime'
import adminStyles from '~/styles/admin.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: adminStyles }]

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  const data = {
    weeks: await db.week.findMany({
      orderBy: {
        date: 'asc',
      },
      select: {
        id: true,
        date: true,
        title: true,
      },
    }),
  }
  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const weekId = form.get('week')
  // console.log('weekid = ', weekId)
  // return json({ weekId })
  return redirect(`admin/${weekId}`)
}

export default function AdminIndexRoute() {
  const data = useLoaderData()
  const submit = useSubmit()

  const handleChange = (e) => {
    submit(e.currentTarget, { replace: true })
  }

  return (
    <main>
      <h2>Admin</h2>
      <Form method="post" onChange={handleChange}>
        <select id="week" name="week" defaultValue="default">
          <option value="default" disabled>
            select week
          </option>
          {data.weeks.map((week) => (
            <option key={week.id} value={week.id}>{`${dateFormat(week.date)}: ${week.title}`}</option>
          ))}
        </select>
      </Form>
      <Outlet />
      <form action="/logout" method="post" id="logout">
        <button type="submit" className="button">
          Logout
        </button>
      </form>
    </main>
  )
}
