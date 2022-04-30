import type { LoaderFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { Week } from '@prisma/client'

import { db } from '~/utils/db.server'

// type LoaderData = { weeks: Array<Week> }

// get games with winner not empty
// determine standing

// export const loader: LoaderFunction = async () => {
//   const data: LoaderData = {
//     weeks: await db.week.findMany({
//       orderBy: {
//         date: 'asc',
//       },
//       include: {
//         games: {
//           orderBy: {
//             time: 'asc',
//           },
//           include: {
//             homeTeam: true,
//             awayTeam: true,
//           },
//         },
//       },
//     }),
//   }
//   return json(data)
// }

export default function Index() {
  // const data = useLoaderData<LoaderData>()
  // console.log({ data })
  return (
    <>
      <h1>XFSL</h1>
      <p>homepage</p>
    </>
  )
}
