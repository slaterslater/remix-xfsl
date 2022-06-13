import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { BiChevronsLeft } from 'react-icons/bi'
import dayjs from 'dayjs'
import { db } from '~/utils/db.server'
import TeamSelect from '~/components/TeamSelect'
import { useState } from 'react'
import BackButton from '~/components/BackButton'

// export type LoaderData

export const loader: LoaderFunction = async ({ params }) => {
  const game = await db.game.findUnique({
    where: {
      id: params.gameId,
    },
    include: {
      awayTeam: true,
      homeTeam: true,
    },
  })
  if (!game) throw new Error('Game not found')
  const teams = await db.team.findMany()
  const data = { game, teams }
  return json(data)
}

export default function AdminGameRoute() {
  const data = useLoaderData()
  const { time, weekId, awayTeam, homeTeam, winner } = data.game
  const hh = dayjs(time).hour()
  const mm = dayjs(time).minute() || '00'
  const [awayTeamName, setAwayTeamName] = useState(awayTeam.name)
  const [homeTeamName, setHomeTeamName] = useState(homeTeam.name)

  return (
    <>
      <BackButton to={`/admin/week/${weekId}`} />
      <Form>
        <div className="flex">
          <label htmlFor="time">Time</label>
          <input type="time" id="time" name="time" defaultValue={`${hh}:${mm}`} />
        </div>
        <TeamSelect
          teams={data.teams}
          label="Away Team"
          name="awayTeam"
          selected={awayTeam.id}
          onChange={setAwayTeamName}
        />
        <TeamSelect
          teams={data.teams}
          label="Home Team"
          name="homeTeam"
          selected={homeTeam.id}
          onChange={setHomeTeamName}
        />
        <div className="flex">
          <label htmlFor="winner">Winner</label>
          <select name="winner" defaultValue={winner || ''}>
            <option value="">{null}</option>
            <option value="away">{awayTeamName}</option>
            <option value="home">{homeTeamName}</option>
            <option value="tie">Tie Game</option>
            <option value="np">Not Played</option>
          </select>
        </div>
        <button type="submit" className="blue button">
          UPDATE
        </button>
      </Form>
    </>
  )
}

// 2DO
// submit
// require session id / user id
// game must have time to save
// validate... if winner but not home or not away then error
// update db

// make gameform as component
// add gameform . and also in new game route
