import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

import type { Week, Game } from '@prisma/client'

import { teams, weeks, games } from './seed-data'

const db = new PrismaClient()

async function seed() {
  await Promise.all(teams.map((team) => db.team.create({ data: team })))

  const newTeams = await db.team.findMany()

  await Promise.all(
    weeks.for((week) => {
      const { title, date, teamBringsBases, teamTakesBases } = week
      const bringBaseId = newTeams.find(({ name }) => name === teamBringsBases)?.id
      const takeBaseId = newTeams.find(({ name }) => name === teamTakesBases)?.id
      const weekData: Week = {
        title,
        date,
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
      const awayTeamId = newTeams.find(({ name }) => name === away)?.id
      const homeTeamId = newTeams.find(({ name }) => name === home)?.id
      const gameData: Game = {
        time,
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
