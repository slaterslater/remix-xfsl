import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'

import { db } from '~/utils/db.server'
import GameTable from '~/components/GameTable'
import type { Team, Week } from '@prisma/client'
import { jan1 } from '~/lib/datetime'

type Game = { awayTeam: Team | null; homeTeam: Team | null; time: Date; id: string }

type LoaderData = {
  weeks: Array<Week & { games: Game[] }>
}

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    weeks: await db.week.findMany({
      orderBy: {
        date: 'asc',
      },
      include: {
        games: {
          orderBy: {
            time: 'asc',
          },
          select: {
            id: true,
            time: true,
            homeTeam: true,
            awayTeam: true,
            gameType: true,
            title: true,
          },
        },
      },
      where: {
        date: {
          gt: jan1,
        },
      },
    }),
  }
  return json(data)
}

export default function ScheduleIndexRoute() {
  const data = useLoaderData<LoaderData>()
  return (
    <main>
      <h2>{`XFSL Season ${new Date().getFullYear()}`}</h2>
      {data.weeks.map((week, i) => (
        <GameTable key={week.id} week={week} index={i} />
      ))}
    </main>
  )
}
