import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

// example route that requires a user to be authenticated
// requester must have `session`

interface ResponseData {
  content?: string
  error?: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  const session = await getSession({ req })

  if (session) {
    res.send({
      content:
        'This is protected content. You can access this content because you are signed in.',
    })
  } else {
    res.send({
      error:
        'You must be signed in to view the protected content on this page.',
    })
  }
}
