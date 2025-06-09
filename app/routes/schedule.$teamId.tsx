import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import dayjs from 'dayjs'
import { BsCloudRain } from 'react-icons/bs'
import { db } from '~/utils/db.server'

export const loader: LoaderFunction = async ({ params }) => {
    const { teamId } = params
    if (!teamId) {
        throw new Response('Team not specified', { status: 400 })
    }

    const games = await db.game.findMany({
        where: {
            OR: [
                { homeTeam: { id: teamId } },
                { awayTeam: { id: teamId } },
            ],
        },
        include: {
            homeTeam: true,
            awayTeam: true,
            week: true,
        },
        orderBy: { time: 'asc' },
    })
    const team = await db.team.findUnique({
        where: { id: teamId },
    })
    // if (games.length === 0) {
    //     // return redirect('/schedule')
    // }
    return json({ team, games })
}

export default function TeamRoute() {
    const { team, games } = useLoaderData<typeof loader>()
    return (
        <main>
            <h2>{`XFSL Season ${new Date().getFullYear()}`}</h2>
            <h3>{team?.fullname}</h3>
            <table id="team-games">
                {games.map(game => {
                    const isHomeGame = game.homeTeam.id === team.id
                    const opponent = [game.awayTeam, game.homeTeam].filter(({ id }) => id !== team.id)[0]
                    return (
                        <tr key={game.id}>
                            <td className='th'>{dayjs(game.time).format('MMM D')}</td>
                            <td>{isHomeGame ? 'vs' : '@'}</td>
                            <td className={opponent.name.toLowerCase()}><Link to={`/schedule/${opponent.id}`}>{opponent.name}</Link></td>
                            <td>{getResult(game.winner, isHomeGame)}</td>
                        </tr>
                    )
                })}
            </table>
        </main>
    )
}

function getResult(winner: string | null, isHomeGame: boolean) {
    console.log(winner, isHomeGame)
    if (!winner) return null
    if (winner === 'tie') return 'T'
    if (winner === 'np') return <BsCloudRain size={12} />
    if (winner === 'home' && isHomeGame) return 'W'
    if (winner === 'away' && !isHomeGame) return 'W'
    return 'L'
}