import type { Week } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { Form, Link, useLoaderData, useSubmit } from '@remix-run/react'
import { timeFormat } from '~/lib/datetime'
import { db } from '~/utils/db.server'
import { AiOutlinePlus as AddIcon } from 'react-icons/ai'
import { useMemo } from 'react'
import TeamSelect from '~/components/TeamSelect'

type LoaderData = { week: Week }

export const loader: LoaderFunction = async ({ params }) => {
  const teams = await db.team.findMany()
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
  const data: LoaderData = { week, teams }
  return json(data)
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  // const test = form.get('test')
  const weekId = form.get('week')
  const gameId = form.get('game')
  if (weekId) {
    // update the base responsibilities
    return json({ message: 'hey' })
  }
  return redirect(`/admin/game/${gameId}`)
}

const GameRow = ({ game }) => {
  const { id, time, awayTeam, homeTeam } = game
  const gameTime = timeFormat(time)
  return (
    <tr>
      <td>
        <input type="checkbox" id={id} name="game" value={id} />
      </td>
      <td>{gameTime}</td>
      <td className={awayTeam?.name.toLowerCase()}>{awayTeam.name}</td>
      <td className={homeTeam?.name.toLowerCase()}>{homeTeam.name}</td>
    </tr>
  )
}

export default function AdminWeekRoute() {
  const data = useLoaderData<LoaderData>()

  const submit = useSubmit()

  const handleChange = (e) => {
    submit(e.currentTarget, { replace: true })
  }

  const { id: weekId, takeBaseId, bringBaseId, games } = data.week

  const baseJobs = useMemo(
    () => [
      { verb: 'bring', id: bringBaseId },
      { verb: 'takes', id: takeBaseId },
    ],
    [data],
  )

  return (
    <>
      <Form method="post" onChange={handleChange}>
        <input type="hidden" id="week" name="week" defaultValue={weekId} />
        {baseJobs.map((job) => (
          <TeamSelect
            key={`${job.verb}-${job.id}`}
            label={`${job.verb} bases`}
            selected={job.id}
            teams={data.teams}
            name={job.verb}
          />
        ))}
      </Form>
      <Form method="post" onChange={handleChange}>
        <table>
          <thead>
            <tr>
              <th>edit</th>
              <th className="offscreen">Time</th>
              <th style={{ minWidth: '90px' }}>Away</th>
              <th style={{ minWidth: '90px' }}>Home</th>
            </tr>
          </thead>
          <tbody>
            {games?.map((game) => (
              <GameRow key={game.id} game={game} />
            ))}
          </tbody>
        </table>
      </Form>
      {games.length < 3 && (
        <Link id="add-new-game" to={`/admin/new/${weekId}`}>
          <AddIcon />
          New Game
        </Link>
      )}
    </>
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
