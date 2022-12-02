/*
 *  an example route to fetch the active user's profile via their session
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import type Profile from '../../interfaces/Profile'
import { read as readProfile } from '../../services/profiles'

interface ResponseData {
  data?: Profile
  error?: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    // fetch & validate the session and Ethereum address
    const session = await getSession({ req })
    if (
      !session ||
      typeof session.address !== 'string' ||
      session.address.length !== 42
    ) {
      return res.status(400).json({ error: 'invalid session' })
    }

    // fetch and return the requested profile from the database
    const [data] = await readProfile(session.address)
    res.status(200).json({ data })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'server error' })
  }
}
