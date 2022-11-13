// DECENT EXAMPLE:
// https://docs.moralis.io/docs/sign-in-with-metamask#configuring-nextauth
// https://github.com/MoralisWeb3/demo-apps/tree/main/nextjs_moralis_auth

import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'

// TODO: add proper credentials
const provider = CredentialsProvider({
  name: 'bingbong',
  credentials: {
    message: {
      label: 'message',
      type: 'text',
      placeholder: '0x0',
    },
  },
  async authorize(credentials) {
    // TODO:
    // verify credentials in here
    // message and signature

    return null
  },
})

export default NextAuth({
  providers: [provider],
})
