import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { db } from '~/utils/db.server'
import BackButton from '~/components/BackButton'
import GameForm from '~/components/GameForm'
import type { Game, Team } from '@prisma/client'

type LoaderData = {
  teams: Array<Team>
  game: Game
}

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
  const data: LoaderData = { game, teams }
  return json(data)
}

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData()
  const gameTime = form.get('time')
  const weekId = form.get('weekId')
  const awayTeamId = form.get('awayTeam')
  const homeTeamId = form.get('homeTeam')
  const winner = form.get('winner')

  const time = new Date(gameTime)
  // we do this type check to be extra sure and to make TypeScript happy
  // we'll explore validation next!
  // if (typeof name !== 'string' || typeof content !== 'string') {
  //   throw new Error(`Form not submitted correctly.`)
  // }
  await db.game.update({
    where: {
      id: params.gameId,
    },
    data: {
      time,
      awayTeamId,
      homeTeamId,
      winner,
    },
  })
  return redirect(`admin/week/${weekId}`)
}

export default function AdminGameRoute() {
  const data = useLoaderData<LoaderData>()
  return (
    <>
      <BackButton to={`/admin/week/${data.game.weekId}`} />
      <GameForm teams={data.teams} game={data.game} />
    </>
  )
}

// 2DO
// require session id / user id
// game must have time to save
// validate... if winner but not home or not away then error
// update db
