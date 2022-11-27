import type { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { getCsrfToken } from 'next-auth/react'
import ConnectWallet from '../components/ConnectWallet'

export default function HomePage() {
  return (
    <div>
      <ConnectWallet />
      <h1>home</h1>
      <Link href='/profile'>go to your profile</Link>
      <hr />
      <p>a simple web3 login with user profiles</p>
    </div>
  )
} // end HomePage()

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}
