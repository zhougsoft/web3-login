import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getCsrfToken } from 'next-auth/react'
import { SiweMessage } from 'siwe'

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          const { NEXTAUTH_URL } = process.env
          if (!NEXTAUTH_URL) throw new Error('no NEXTAUTH_URL env variable set')

          // signature authentication logic
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'))
          const nextAuthUrl = new URL(NEXTAUTH_URL)

          const result = await siwe.verify({
            signature: credentials?.signature || '',
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req }),
          })

          if (result.success) {
            // any object returned will be saved in `user` property of the JWT
            return {
              id: siwe.address,
            }
          }

          // if null returned, error will be displayed advising the user to check their details
          return null
        } catch (error) {
          // *** you can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          return null
        }
      },
    }),
  ]



  // hide Sign-In with Ethereum from the default sign page
  const isDefaultSigninPage =
    req.method === 'GET' && req.query?.nextauth?.includes('signin')

  if (isDefaultSigninPage) {
    providers.pop()
  }

  const authOptions: NextAuthOptions = {
    providers,
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }: { session: any; token: any }) {
        session.address = token.sub
        session.user.name = token.sub
        return session
      },
    },
  }

  return NextAuth(req, res, authOptions)
}
