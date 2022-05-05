import type { Week, Team } from '@prisma/client'
import dayjs from 'dayjs'
import { useEffect, useRef } from 'react'
import { BsXDiamondFill } from 'react-icons/bs'

type Game = { awayTeam: Team | null; homeTeam: Team | null; time: Date; id: string }

type Props = {
  week: Week & { games: Game[] }
  index: number
}

export default function GameTable({ week, index = 0 }: Props) {
  if (!week) return <></>
  const { id: weekId, title, date, games, bringBaseId, takeBaseId } = week
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
      <h3 id={weekId} ref={weekRef}>
        {isGame ? title : gameDay}
      </h3>
      {isGame && (
        <table>
          {index % 2 === 0 ? (
            <caption>
              <BsXDiamondFill size={12} /> brings bases / takes bases
            </caption>
          ) : null}
          <thead>
            <tr>
              <th className="offsceen">Time</th>
              <th style={{ minWidth: '115px' }}>Away</th>
              <th style={{ minWidth: '115px' }}>Home</th>
            </tr>
          </thead>
          <tbody>
            {games?.map((game: Game) => {
              const { id: gameId, time, awayTeam, homeTeam } = game
              return (
                <tr key={gameId}>
                  <td className="th">{dayjs(time).format('hmm')}</td>
                  {Array.from([awayTeam, homeTeam]).map((team, i) => {
                    const isResponsible = team?.id === bringBaseId || team?.id === takeBaseId
                    return (
                      <td key={`team-${i}`} className={team?.name.toLowerCase()}>
                        {team?.name}
                        {` `}
                        {isResponsible && <BsXDiamondFill size={12} />}
                      </td>
                    )
                  })}
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
