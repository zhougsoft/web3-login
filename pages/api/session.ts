import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import type { Session } from 'next-auth'

// route to fetch the active session via api

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Session | null> // TODO: remove 'any' type after debugging
) => {
  const session = await getSession({ req })
  res.status(200).json(session || null)
}
