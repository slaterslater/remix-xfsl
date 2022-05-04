import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { Week, Game, Team } from '@prisma/client'

import { db } from '~/utils/db.server'
import dayjs from 'dayjs'
import GameTable from '~/components/GameTable'
import Standings from '~/components/Standings'

type LoaderData = {
  teams: Array<Team>
  week: Week | null
  playedGames: Array<{ awayTeam: Team | null; homeTeam: Team | null; winner: string }>
}

// get games with winner not empty
// determine standing

export const loader: LoaderFunction = async () => {
  const today = dayjs().day(4).toISOString()
  const seasonEnd = dayjs('2022-09-08').toISOString()
  const data: LoaderData = {
    teams: await db.team.findMany(),
    week: await db.week.findFirst({
      where: {
        date: {
          equals: today,
        },
      },
      include: {
        bringBaseTeam: true,
        takeBaseTeam: true,
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
    }),
    playedGames: await db.game.findMany({
      select: {
        winner: true,
        time: true,
        awayTeam: true,
        homeTeam: true,
      },
      where: {
        AND: [
          {
            winner: {
              not: '',
            },
          },
          {
            time: {
              lte: seasonEnd,
            },
          },
        ],
      },
    }),
  }
  return json(data)
}

export default function Index() {
  const data = useLoaderData<LoaderData>()
  const { teams, week, playedGames } = data
  return (
    <main>
      <h2>{dayjs(data.week?.date).format('MMMM D')}</h2>
      <GameTable title={week?.title} games={week?.games} />
      <h3>XFSL Standings</h3>
      <Standings teams={teams} games={playedGames} />
    </main>
  )
}
