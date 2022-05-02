import type { Team } from '@prisma/client'
// import { teams } from 'prisma/seed-data'
import { useMemo } from 'react'

type Props = {
  games: Array<{ awayTeam: Team | null; homeTeam: Team | null; winner: string }>
}

// type Played = { awayTeam: Team | null; homeTeam: Team | null; winner: string }

export default function Standings({ games }: Props) {
  const standings = useMemo(
    () =>
      games
        .reduce((teamData, game) => {
          if (!['away', 'home', 'tie'].includes(game.winner)) return teamData
          // find team in teamData or init new rank
          const [away, home] = Array.from([game.awayTeam, game.homeTeam]).map((team) => {
            const i = teamData.indexOf(teamData.find(({ name }) => name === team.name))
            if (i === -1) {
              teamData.push({
                ...team,
                gp: 0,
                wins: 0,
                loss: 0,
                ties: 0,
                pts: 0,
              })
            }
            return teamData.splice(i, 1).pop()
          })
          // update stats for each team
          const { winner } = game
          if (winner !== 'tie') {
            const [winningTeam, losingTeam] = winner === 'home' ? [home, away] : [away, home]
            winningTeam.wins += 1
            losingTeam.loss += 1
          }
          Array.from([away, home]).forEach((team) => {
            team.gp += 1
            team.ties += winner === 'tie' ? 1 : 0
            team.pts = 2 * team.wins + team.ties
          })
          teamData.push(away, home)
          return teamData
        }, [])
        .sort((a, b) => b.pts - a.pts),
    [games],
  )

  console.log({ standings })

  return (
    <table>
      <thead>
        <tr>
          <th>
            <span className="offscreen">Position</span>
          </th>
          <th>
            <span className="offscreen">TEAM</span>
          </th>
          <th>
            <div title="games played">GP</div>
          </th>
          <th>
            <div title="wins">W</div>
          </th>
          <th>
            <div title="losses">L</div>
          </th>
          <th>
            <div title="ties">T</div>
          </th>
          <th>
            <div title="points">PTS</div>
          </th>
        </tr>
      </thead>
      <tbody>
        {standings.map((team, i) => {
          const { id, name, gp, wins, loss, ties, pts } = team
          const rank = ['st', 'nd', 'rd']
          return (
            <tr className={name.toLowerCase()} key={id}>
              <td className="th">
                {i + 1}
                <sup>{rank[i] || 'th'}</sup>
              </td>
              <td>{name}</td>
              <td>{gp}</td>
              <td>{wins}</td>
              <td>{loss}</td>
              <td>{ties}</td>
              <td>{pts}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
