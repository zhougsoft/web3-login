import type { NextApiRequest, NextApiResponse } from 'next'
import type Profile from '../../../interfaces/Profile'
import { read as readProfile } from '../../../services/profiles'

interface ResponseData {
  data?: Profile | Profile[]
  error?: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    const { address: addressQuery } = req.query
    if (typeof addressQuery !== 'string' || addressQuery.length !== 42) {
      return res.status(400).json({ error: 'invalid address query input' })
    }

    const [data] = await readProfile(addressQuery)
    return res.status(200).json({ data })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'server error' })
  }
}
