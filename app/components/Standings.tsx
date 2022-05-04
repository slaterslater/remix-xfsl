import type { Team } from '@prisma/client'
import { useMemo } from 'react'

type Props = {
  teams: Array<Team>
  games: Array<{ awayTeam: Team | null; homeTeam: Team | null; winner: string }>
}

type TeamData =
  | {
      gp: number
      wins: never[]
      loss: never[]
      ties: never[]
      pts: number
      id: string
      name: string
    }
  | undefined

export default function Standings({ teams, games }: Props) {
  const standings = useMemo(() => {
    const standingsInit = teams.map((team) => ({
      ...team,
      gp: 0,
      wins: [],
      loss: [],
      ties: [],
      pts: 0,
      rank: null,
    }))

    const teamsWithGameResults = games
      .reduce((teamData, game) => {
        if (!['away', 'home', 'tie'].includes(game.winner)) return teamData

        const [awayTeam, homeTeam] = Array.from([game.awayTeam, game.homeTeam]).map((team) => {
          const i = teamData.indexOf(teamData.find(({ name }) => name === team.name))
          return teamData.splice(i, 1).pop()
        })

        let awayResult
        let homeResult
        switch (game.winner) {
          case 'away':
            awayResult = 'wins'
            homeResult = 'loss'
            break
          case 'home':
            awayResult = 'loss'
            homeResult = 'wins'
            break
          default:
            awayResult = 'ties'
            homeResult = 'ties'
        }

        const updateStats = (team, result, opponent) => {
          team[result].push(opponent.name)
          team.gp += 1
          team.pts = 2 * team.wins.length + team.ties.length
          teamData.push(team)
        }

        updateStats(awayTeam, awayResult, homeTeam)
        updateStats(homeTeam, homeResult, awayTeam)

        return teamData
      }, standingsInit)
      .sort((a, b) => {
        if (a.pts === b.pts) {
          const tiebreaker = (team, opponent) => team.wins.filter((loser) => loser === opponent.name).length
          const tiebreakerA = tiebreaker(a, b)
          const tiebreakerB = tiebreaker(b, a)
          if (tiebreakerB === tiebreakerA) {
            const sharedRank = `${a.pts}-${tiebreakerB}`
            a.rank = sharedRank
            b.rank = sharedRank
            console.log(a.name, a.rank, b.name, b.rank)
          }
          return tiebreakerB - tiebreakerA
        }
        return b.pts - a.pts
      })

    let rank = 0
    let sharedRank = null

    return teamsWithGameResults.map((team) => {
      console.log(rank, sharedRank)
      if (team.rank) {
        if (sharedRank == null) sharedRank = rank
        team.rank = sharedRank
        console.log(team.name, team.rank)
      } else {
        sharedRank = null
        team.rank = rank
      }
      rank += 1
      return team
    })
  }, [games])

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
          const { id, name, gp, wins, loss, ties, pts, rank } = team
          const suffix = ['st', 'nd', 'rd']
          return (
            <tr className={name.toLowerCase()} key={id}>
              <td className="th">
                {rank + 1}
                <sup>{suffix[rank] || 'th'}</sup>
              </td>
              <td>{name}</td>
              <td>{gp}</td>
              <td>{wins.length}</td>
              <td>{loss.length}</td>
              <td>{ties.length}</td>
              <td>{pts}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
