import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

// example route that requires a user to be authenticated
// requester must have `session`

interface ResponseData {
  data?: string
  error?: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const session = await getSession({ req })

  if (session) {
    res.status(200).send({
      data: 'congratulations! you got the magic thing.\nyou can access the magic thing because you are logged in!',
    })
  } else {
    res.status(403).send({
      error: 'you must be logged in to access the magic thing :(',
    })
  }
}
