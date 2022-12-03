/*
 *  POST, PUT & DELETE records from the 'profiles' table
 */

import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { utils } from 'ethers'

import type Profile from '../../../interfaces/Profile'
import {
  create as createProfile,
  update as updateProfile,
  del as deleteProfile,
} from '../../../services/profiles'

interface ResponseData {
  data?: Profile | Profile[]
  error?: string
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    const session = await getSession({ req })
    const inputData: Profile = JSON.parse(req.body)
    const sessionAddress = session?.address
    const inputAddress = inputData?.address

    // validating incoming address data
    if (
      !sessionAddress ||
      !inputAddress ||
      typeof sessionAddress !== 'string' ||
      typeof inputAddress !== 'string' ||
      !utils.isAddress(sessionAddress) ||
      !utils.isAddress(inputAddress)
    ) {
      return res.status(400).json({ error: 'invalid address data' })
    }

    // protect route by confirming the authenticated address matches the profile getting updated
    if (utils.getAddress(sessionAddress) !== utils.getAddress(inputAddress)) {
      return res.status(403).json({ error: 'invalid address credentials' })
    }

    switch (req.method) {
      case 'POST':
        return res.status(201).json({ data: await createProfile(inputData) })

      case 'PUT':
        const updated = await updateProfile(inputData)
        return res
          .status(updated.length > 0 ? 200 : 404)
          .json({ data: updated })

      case 'DELETE':
        const removed = await deleteProfile(inputData)
        return res.status(removed.length > 0 ? 204 : 404).end()
      default:
        return res.status(405).json({ error: 'method not allowed' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'server error' })
  }
}
