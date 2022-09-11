import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import GameForm from '~/components/GameForm'
import { db } from '~/utils/db.server'
import BackButton from '~/components/BackButton'

export const loader: LoaderFunction = async ({ params }) => {
  const { weekId } = params
  const teams = await db.team.findMany()
  const week = await db.week.findUnique({
    where: {
      id: weekId,
    },
    select: {
      date: true,
    },
  })
  return json({ weekId, time: week.date, teams })
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

  const data = {
    weekId,
    time,
    awayTeamId,
    homeTeamId,
    winner,
  }
  await db.game.create({ data })
  return redirect(`admin/week/${weekId}`)
}

export default function NewGameRoute() {
  const data = useLoaderData()
  const { weekId, teams, time } = data
  return (
    <>
      <BackButton to={`/admin/week/${weekId}`} />
      <GameForm teams={teams} game={{ weekId, time }} />
    </>
  )
}
