import type { Week, Team } from '@prisma/client'
import dayjs from 'dayjs'
import { useEffect, useRef } from 'react'
import { BsCloudRain, BsXDiamondFill } from 'react-icons/bs'
import { MdOutlinePlusOne, MdOutlineExposurePlus2 } from "react-icons/md"
import type { IconType } from 'react-icons'
import { dateFormat, gameDayFormat, timeFormat } from '~/lib/datetime'

type Game = {
  awayTeam: Team | null
  homeTeam: Team | null
  time: Date
  id: string
  gameType: string
  title: string
  winner: string | null
}

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

  const hasPlayed = dayjs(week.date).isAfter(dayjs())

  return (
    <>
      <h3 id={weekId} ref={weekRef}>
        {isHomePage ? title : gameDay}
      </h3>
      {isGame && (
        <table>
          {hasPlayed && (index % 2 === 0) && (
            <caption>
              <BsXDiamondFill size={12} /> brings bases / takes bases
            </caption>
          )}
          <thead>
            <tr>
              <th className="offscreen">Time</th>
              <th style={{ minWidth: '115px', verticalAlign: 'middle' }}>Away</th>
              <th style={{ minWidth: '115px', verticalAlign: 'middle' }}>Home</th>
            </tr>
          </thead>
          <tbody>
            {games?.map((game: Game, i) => {
              const { id: gameId, time, awayTeam, homeTeam, gameType, winner } = game
              const gameTime = timeFormat(time)
              const isLeagueGame = gameType !== 'EXHIBITION'
              return (
                <tr key={gameId}>
                  <td className="th" style={{ verticalAlign: 'middle' }}>{gameTime}</td>
                  {isLeagueGame &&
                    Array.from([awayTeam, homeTeam]).map((team, i) => {
                      const isResponsible = !winner && (team?.id === bringBaseId || team?.id === takeBaseId)
                      const teamName = team?.name.toLowerCase()
                      const classNames = [teamName].filter(Boolean).join(' ')
                      return (
                        <td key={`team-${i}`} className={classNames} style={{ verticalAlign: 'middle' }}>
                          {team?.name + ' '}
                          {isResponsible && <BsXDiamondFill size={12} />}
                          {getResult(winner, i)}
                        </td>
                      )
                    })}
                  {!isLeagueGame && (
                    <td className={`exhibition-${i % 2}`} colSpan={2} style={{ verticalAlign: 'middle' }}>
                      {game.title}
                    </td>
                  )}
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

function getResult(winner: string | null, i: number) {
  if (!winner) return null
  switch (winner) {
    case 'tie':
      return <MdOutlinePlusOne size={12} />
    case 'away':
      return i === 0 ? <MdOutlineExposurePlus2 size={12} /> : null
    case 'home':
      return i === 1 ? <MdOutlineExposurePlus2 size={12} /> : null
    case 'np':
      return <BsCloudRain size={12} />
    default:
      return null
  }
}
