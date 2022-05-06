import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { Week, Team } from '@prisma/client'

import { db } from '~/utils/db.server'
import dayjs from 'dayjs'
import GameTable from '~/components/GameTable'
import Standings from '~/components/Standings'

type Game = { awayTeam: Team | null; homeTeam: Team | null; time: Date; id: string }

type LoaderData = {
  teams: Array<Team>
  week: (Week & { games: Game[] }) | null
  playedGames: Array<{ awayTeam: Team | null; homeTeam: Team | null; winner: string }>
}

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

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>()
  const { teams, week, playedGames } = data
  return (
    <main>
      <h2>{dayjs(data.week?.date).format('MMMM D')}</h2>
      {week && <GameTable week={week} index={0} />}
      <h3>XFSL Standings</h3>
      <Standings teams={teams} games={playedGames} />
    </main>
  )
}
