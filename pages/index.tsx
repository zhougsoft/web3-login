import type { GetServerSidePropsContext } from 'next'
import { getCsrfToken, useSession, signIn, signOut } from 'next-auth/react'
import { useWeb3 } from '../hooks/useWeb3'

export default function HomePage() {
  const { isConnected, address, connect, signMessageAsync } = useWeb3()
  const { data: session } = useSession()

  async function handleLogin(e: any) {
    e.preventDefault()
    if (!isConnected || !address) {
      console.warn('HomePage - handleLogin() called with no wallet connected')
      return
    }

    // -------------TODO-----------------

    console.info('handleLogin() called')

    // sign message

    // get results

    // if valid, sign in:
    // signIn('credentials', {})

    // ----------------------------------
  }

  async function handleLogout(e: any) {
    e.preventDefault()
    signOut()
  }

  // is loading
  if (!isConnected && !connect) return <>standby...</>

  // no wallet connected
  if (!isConnected && connect) {
    return (
      <>
        <button onClick={() => connect()}>connect</button>
      </>
    )
  }

  // wallet is connected
  if (isConnected && address) {
    return (
      <>
        <div>connected: {address}</div>
        {/*  if session exists, display info & logout button */}
        {/*  else, display login button */}
        {session ? (
          <>
            <hr />
            <button onClick={handleLogout}>logout</button>
            <small>logged in as {JSON.stringify(session)}</small>
          </>
        ) : (
          <>
            <button onClick={handleLogin}>login</button>
          </>
        )}
      </>
    )
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}
