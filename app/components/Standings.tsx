import type { Team } from '@prisma/client'
import { Link } from '@remix-run/react'
import { useMemo } from 'react'

type Props = {
  teams: Array<Team>
  games: Array<{ awayTeam: Team | null; homeTeam: Team | null; winner: string }>
}

export default function Standings({ teams, games }: Props) {
  const standings = useMemo(() => {
    const standingsInit = teams.map((team) => ({
      ...team,
      gp: 0,
      wins: [],
      loss: [],
      ties: [],
      pts: 0,
      rank: false,
      breaker: null,
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
      .map((team, _, teams) => {
        if (team.breaker) return team
        teams
          .filter(({ pts }) => pts === team.pts)
          .forEach((t, _, group) => {
            const names = group.map((each) => each.name)
            const numOccurance = (n) => n.filter((name) => names.includes(name)).length
            t.breaker = 2 * numOccurance(t.wins) + numOccurance(t.ties)
          })
        return team
      })
      .sort((a, b) => {
        if (a.pts !== b.pts) return b.pts - a.pts
        if (a.breaker === b.breaker) {
          a.rank = true
          b.rank = true
        }
        return b.breaker - a.breaker
      })

    let rank = 0
    let shared = {
      pts: 0,
      rank: null,
    }

    return teamsWithGameResults.map((team) => {
      if (team.rank) {
        if (shared.rank === null || team.pts !== shared.pts) {
          shared = {
            pts: team.pts,
            rank,
          }
        }
        team.rank = shared.rank
      } else {
        shared.rank = null
        team.rank = rank
      }
      rank += 1
      return team
    })
  }, [teams, games])

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

              <td><Link to={`/schedule/${id}`}>{name}</Link></td>
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
