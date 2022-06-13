import { Form } from '@remix-run/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import TeamSelect from './TeamSelect'

export default function GameForm({ teams, game }) {
  const { time, weekId, awayTeam, homeTeam, winner } = game || {}
  const hh = dayjs(time).hour()
  const mm = dayjs(time).minute() || '00'
  const [awayTeamName, setAwayTeamName] = useState(awayTeam?.name)
  const [homeTeamName, setHomeTeamName] = useState(homeTeam?.name)
  return (
    <Form>
      <div className="flex">
        <label htmlFor="time">Time</label>
        <input type="time" id="time" name="time" defaultValue={time ? `${hh}:${mm}` : ''} />
      </div>
      <TeamSelect teams={teams} label="Away Team" name="awayTeam" selected={awayTeam?.id} onChange={setAwayTeamName} />
      <TeamSelect teams={teams} label="Home Team" name="homeTeam" selected={homeTeam?.id} onChange={setHomeTeamName} />
      <div className="flex">
        <label htmlFor="winner">Winner</label>
        <select name="winner" defaultValue={winner || ''}>
          <option value="">{null}</option>
          <option value="away">{awayTeamName}</option>
          <option value="home">{homeTeamName}</option>
          <option value="tie">Tie Game</option>
          <option value="np">Not Played</option>
        </select>
      </div>
      <button type="submit" className="blue button">
        UPDATE
      </button>
    </Form>
  )
}
