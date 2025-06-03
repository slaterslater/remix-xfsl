import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

import type { Week, Game, Team } from '@prisma/client'

import { weeks, games } from '../notes/2025/seed-data-2025'

const db = new PrismaClient()
// const { USERNAME, PASSWORD } = process.env

async function seed() {
  // await db.user.create({
  //   data: { username: USERNAME, passwordHash: PASSWORD },
  // })

  // await Promise.all(teams.map((team) => db.team.create({ data: team })))

  const teams = await db.team.findMany()

  const idFromTeamName = (name: string | null): number | null =>
    teams.find((team: Team) => name === team.name)?.id || null

  const teamIds = (teamsNames: (string | null)[]) => teamsNames.map((name: string | null) => idFromTeamName(name))

  await Promise.all(
    weeks.map((week) => {
      const { title, date, teamBringsBases, teamTakesBases } = week
      const [bringBaseId, takeBaseId] = teamIds([teamBringsBases, teamTakesBases])
      const weekData = {
        title,
        date: new Date(date),
        bringBaseId,
        takeBaseId,
      }
      return db.week.create({ data: weekData })
    }),
  )

  const newWeeks = await db.week.findMany()

  await Promise.all(
    games.map((game) => {
      const { time, away, home, winner } = game
      const weekId = newWeeks.find(({ date }) => dayjs(date).isSame(time, 'day'))?.id
      const [awayTeamId, homeTeamId] = teamIds([away, home])
      const gameData: any = {
        time: new Date(time),
        weekId,
        awayTeamId,
        homeTeamId,
        winner,
      }
      return db.game.create({ data: gameData })
    }),
  )
}

seed()
