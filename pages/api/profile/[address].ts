/*
 *  GET profile records from the 'profiles' table
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { utils } from 'ethers'
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
    const { address } = req.query

    // validate incoming address
    if (!address || typeof address != 'string' || !utils.isAddress(address)) {
      return res.status(400).json({ error: 'invalid address query input' })
    }

    // if valid address, fetch it's matching record and return any records found
    const [data] = await readProfile(address)
    return res.status(200).json({ data })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'server error' })
  }
}
