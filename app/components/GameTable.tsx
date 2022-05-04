import type { Week, Team } from '@prisma/client'
import dayjs from 'dayjs'
import { useEffect, useRef } from 'react'

type Game = { awayTeam: Team | null; homeTeam: Team | null; time: Date; id: string }

type Props = {
  week: Week & { games: Game[] }
}

export default function GameTable({ week }: Props) {
  const { id, title, date, games, bringBaseId, takeBaseId } = week
  const gameDay = dayjs(date).format('MMMM D')
  const weekRef = useRef<HTMLHeadingElement>(null)
  const isGame = !!games.length
  useEffect(() => {
    const thisWeek = dayjs().day(4).format('MMMM D')
    if (gameDay !== thisWeek || weekRef.current == null) return
    weekRef.current.scrollIntoView()
  }, [gameDay])
  return (
    <>
      <h3 id={id} ref={weekRef}>
        {isGame ? title : gameDay}
      </h3>
      {isGame && (
        <table>
          <thead>
            <tr>
              <th className="offsceen">Time</th>
              <th style={{ minWidth: '115px' }}>Away</th>
              <th style={{ minWidth: '115px' }}>Home</th>
            </tr>
          </thead>
          <tbody>
            {games?.map((game: Game) => {
              // console.log({ game })
              const { time, awayTeam, homeTeam } = game
              return (
                <tr key={String(time)}>
                  <td className="th">{dayjs(time).format('hmm')}</td>
                  <td className={awayTeam?.name.toLowerCase()}>{awayTeam?.name}</td>
                  <td className={homeTeam?.name.toLowerCase()}>{homeTeam?.name}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
      {!isGame && (
        <div className="schedule-placeholder">
          <p>{title}</p>
        </div>
      )}
    </>
  )
}
