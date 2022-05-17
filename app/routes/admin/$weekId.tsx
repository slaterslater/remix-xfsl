import type { Week } from '@prisma/client'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { db } from '~/utils/db.server'

type LoaderData = { week: Week }

export const loader: LoaderFunction = async ({ params }) => {
  const week = await db.week.findUnique({
    where: { id: params.weekId },
  })
  if (!week) throw new Error('Week not found')
  const data: LoaderData = { week }
  return json(data)
}

export default function AdminWeekRoute() {
  const data = useLoaderData<LoaderData>()
  console.log({ data })
  return <p>games</p>
}

// toDO
// 1. loader needs to return all teams
// ... show bring  / take bases and edit
// 2. need one form to add a new game
// ...on added it should refresh this page
// 3. form for each current game
// ... game time must be required
// pick time, home, away, winner
