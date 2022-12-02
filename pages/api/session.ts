/*
 *  an example route to fetch the user's active session via the API
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import type { Session } from 'next-auth'

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Session | null>
) => {
  const session = await getSession({ req })
  res.status(200).json(session || null)
}
