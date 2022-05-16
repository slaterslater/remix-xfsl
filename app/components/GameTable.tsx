import type { Week, Team } from '@prisma/client'
import { useEffect, useRef } from 'react'
import { BsXDiamondFill } from 'react-icons/bs'
import { dateFormat, gameDayFormat, timeFormat } from '~/lib/datetime'

type Game = { awayTeam: Team | null; homeTeam: Team | null; time: Date; id: string }

type Props = {
  week: Week & { games: Game[] }
  index?: number
  isHomePage?: boolean
}

export default function GameTable({ week, index = 0, isHomePage = false }: Props) {
  const weekRef = useRef<HTMLHeadingElement>(null)
  const gameDay = dateFormat(week?.date)

  useEffect(() => {
    const thisWeek = gameDayFormat()
    if (isHomePage || gameDay !== thisWeek || weekRef.current == null) return
    weekRef.current.scrollIntoView()
  }, [gameDay, isHomePage])

  const { id: weekId, title, games, bringBaseId, takeBaseId } = week
  const isGame = !!games.length

  return (
    <>
      <h3 id={weekId} ref={weekRef}>
        {isHomePage ? title : gameDay}
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
              const gameTime = timeFormat(time)
              return (
                <tr key={gameId}>
                  <td className="th">{gameTime}</td>
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
