import type { LoaderFunction } from '@remix-run/node'
import { ActionFunction, json, Response, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useLoaderData } from '@remix-run/react'
import { getUserId, requireUserId } from '~/utils/session.server'

import { db } from '~/utils/db.server'
import { dateFormat } from '~/lib/datetime'

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

export default function AdminIndexRoute() {
  const data = useLoaderData()
  return (
    <>
      <ul>
        {data.weeks.map((week) => (
          <li key={week.id}>
            <Link to=".">{`${dateFormat(week.date)}: ${week.title}`}</Link>
          </li>
        ))}
      </ul>
      <form action="/logout" method="post">
        <button type="submit" className="button">
          Logout
        </button>
      </form>
    </>
  )
}
