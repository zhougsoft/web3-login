import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import type Profile from '../../interfaces/Profile'
import { read as readProfile } from '../../services/profiles'

// route to fetch the user profile of the active session

interface ResponseData {
  data?: Profile
  error?: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    // fetch & validate the session
    const session = await getSession({ req })
    if (
      !session ||
      typeof session.address !== 'string' ||
      session.address.length !== 42
    ) {
      return res.status(400).json({ error: 'invalid session' })
    }

    // get requested profile from database & return
    const [data] = await readProfile(session.address)
    res.status(200).json({ data })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'server error' })
  }
}
