import { Form } from '@remix-run/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import type { Team, Game } from '@prisma/client'
import TeamSelect from './TeamSelect'

interface GameInterface {
  teams: Team[]
  game?: Game
}

export default function GameForm({ teams, game }: GameInterface) {
  const { time, weekId, awayTeam, homeTeam, winner } = game || {}
  const [timeValue, setTimeValue] = useState(String(time))
  const hour = dayjs(time).hour()
  const minute = dayjs(time).minute() || '00'
  const defaultTime = time ? `${hour}:${minute}` : ''
  const [awayTeamName, setAwayTeamName] = useState(awayTeam?.name)
  const [homeTeamName, setHomeTeamName] = useState(homeTeam?.name)

  const handleChange = (e) => {
    const [hh, mm] = e.target.value.split(':')
    const updateTime = dayjs(time)
      .hour(hh || 0)
      .minute(mm || 0)
      .toISOString()

    setTimeValue(updateTime)
  }

  return (
    <Form method="post">
      <input type="hidden" id="time" name="time" value={timeValue} key={timeValue} />
      <input type="hidden" id="weekId" name="weekId" value={weekId} />
      <div className="flex">
        <label htmlFor="time">Time</label>
        <input type="time" id="gameTime" name="gameTime" defaultValue={defaultTime} onChange={handleChange} />
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
        UPDATE GAME
      </button>
    </Form>
  )
}
