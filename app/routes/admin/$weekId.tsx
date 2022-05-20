import type { Week } from '@prisma/client'
import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { timeFormat } from '~/lib/datetime'
import { db } from '~/utils/db.server'

type LoaderData = { week: Week }

export const loader: LoaderFunction = async ({ params }) => {
  const week = await db.week.findUnique({
    where: { id: params.weekId },
    include: {
      games: {
        orderBy: {
          time: 'asc',
        },
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
  })
  if (!week) throw new Error('Week not found')
  const data: LoaderData = { week }
  return json(data)
}

const handleChange = (e) => {
  console.log('selected', e.target)
}

const GameSelect = ({ weekId, game }) => {
  const { id, time, awayTeam, homeTeam } = game
  const gameTime = timeFormat(time)
  return (
    <div className="gameSelect" key={id}>
      <input type="radio" id={id} name={weekId} value={id} />
      <label htmlFor={id}>{`${awayTeam.name} vs ${homeTeam.name} @ ${gameTime}`}</label>
    </div>
  )
}

export default function AdminWeekRoute() {
  const data = useLoaderData<LoaderData>()
  console.log({ data })
  return (
    <Form method="post" onChange={handleChange}>
      {data.week?.games?.map((game) => (
        <GameSelect key={game.id} weekId={data.week.id} game={game} />
      ))}
    </Form>
  )
}

// toDO
// 1. loader needs to return all teams
// ... show bring  / take bases and edit
// 2. need one form to add a new game
// ...on added it should refresh this page
// 3. form for each current game
// ... game time must be required
// pick time, home, away, winner
