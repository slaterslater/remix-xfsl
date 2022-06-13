import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import GameForm from '~/components/GameForm'
import { db } from '~/utils/db.server'
import BackButton from '~/components/BackButton'

export const loader: LoaderFunction = async ({ params }) => {
  const { weekId } = params
  const teams = await db.team.findMany()
  const data = { weekId, teams }
  return json(data)
}

export default function NewGameRoute() {
  const data = useLoaderData()
  const { weekId, teams } = data
  return (
    <>
      <BackButton to={`/admin/week/${weekId}`} />
      <GameForm teams={teams} />
      {/* <p>new game goes here</p>
      <button type="submit" className="blue button">
        ADD
      </button> */}
    </>
  )
}
