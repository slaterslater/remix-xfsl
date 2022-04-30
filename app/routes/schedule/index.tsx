import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { LiveReload, useLoaderData } from '@remix-run/react'
import type { Week, Game } from '@prisma/client'

import { db } from '~/utils/db.server'
import dayjs from 'dayjs'

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
  console.log({ data })
  return (
    <>
      <LiveReload />
      <h2>XFSL Season 2022</h2>
      {data.weeks.map((week) => {
        const { id, date, games } = week
        return (
          <div key={id} id={id}>
            {/* <h3>{dayjs(week.datetime).format("MMMM D")}</h3> */}
            <h3>{dayjs(date).format('MMMM D')}</h3>
            <table>
              <thead>
                <tr>
                  <th className="offsceen">Time</th>
                  <th style={{ minWidth: '115px' }}>Away</th>
                  <th style={{ minWidth: '115px' }}>Home</th>
                </tr>
              </thead>
              <tbody>
                {games?.map((game: Game) => (
                  <tr key={game.id}>
                    <td className="th">{dayjs(game.time).format('hmm')}</td>
                    <td className={game.awayTeam.name}>{game.awayTeam.name}</td>
                    <td className={game.homeTeam.name}>{game.homeTeam.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </>
  )
}
