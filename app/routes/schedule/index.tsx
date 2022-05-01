import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { Week, Game } from '@prisma/client'

import { db } from '~/utils/db.server'
import dayjs from 'dayjs'
import GameTable from '~/components/GameTable'

// type LoaderData = { weeks: Array<Week> &  }

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
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        },
      },
    }),
  }
  return json(data)
}

export default function Index() {
  const data = useLoaderData<LoaderData>()
  return (
    <main>
      <h2>XFSL Season 2022</h2>
      {data.weeks.map((week) => {
        const { id, date, title, games } = week
        const gameDay = dayjs(date).format('MMMM D')
        return (
          <div key={id} id={id}>
            {games.length ? (
              <GameTable title={gameDay} games={games} />
            ) : (
              <>
                <h3>{gameDay}</h3>
                <div className="schedule-placeholder">
                  <p>{title}</p>
                </div>
              </>
            )}
          </div>
        )
      })}
    </main>
  )
}
