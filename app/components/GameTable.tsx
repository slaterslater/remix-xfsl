import type { Game } from '@prisma/client'
import dayjs from 'dayjs'
import { useEffect, useRef } from 'react'

type Props = {
  title: string | undefined
  games: Array<Game>
}

export default function GameTable({ title, games }: Props) {
  const weekRef = useRef(null)
  useEffect(() => {
    const thisWeek = dayjs().day(4).format('MMMM D')
    if (title !== thisWeek) return
    weekRef?.current.scrollIntoView()
  }, [title])

  if (!games?.length) return <></>
  return (
    <>
      <h3 ref={weekRef}>{title}</h3>
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
            const { id, time, awayTeam, homeTeam } = game
            return (
              <tr key={id}>
                <td className="th">{dayjs(time).format('hmm')}</td>
                <td className={awayTeam.name.toLowerCase()}>{awayTeam.name}</td>
                <td className={homeTeam.name.toLowerCase()}>{homeTeam.name}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
