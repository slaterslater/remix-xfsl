import type { LinksFunction, LoaderFunction, ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, Outlet, useLoaderData, useSubmit } from '@remix-run/react'
import { requireUserId } from '~/utils/session.server'

import { db } from '~/utils/db.server'
import { dateFormat, jan1 } from '~/lib/datetime'
import adminStyles from '~/styles/admin.css'
import dayjs from 'dayjs'

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
      where: {
        date: {
          gt: jan1,
        },
      },
    }),
  }
  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const weekId = form.get('week')
  return redirect(`admin/week/${weekId}`)
}

export default function AdminIndexRoute() {
  const data = useLoaderData()
  const submit = useSubmit()

  const handleChange = (e) => {
    submit(e.currentTarget, { replace: true })
  }

  const isCurrent = (date) => dayjs().isSame(date, 'week')

  return (
    <main>
      <h2>Admin</h2>
      <Form method="post" onChange={handleChange}>
        <div className="flex">
          <label htmlFor="week">Select date</label>
          <select id="week" name="week" defaultValue="">
            <option value="" disabled>
              {null}
            </option>
            {data.weeks?.map((week) => (
              <option key={week.id} value={week.id}>{`${dateFormat(week.date)} ${
                isCurrent(week.date) ? '*****' : ''
              }`}</option>
            ))}
          </select>
        </div>
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
