import type { GetServerSidePropsContext } from 'next'
import { getCsrfToken, useSession, signIn, signOut } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useWeb3 } from '../hooks/useWeb3'

export default function HomePage() {
  const { isConnected, address, activeChain, connect, signMessageAsync } =
    useWeb3()
  const { data: session } = useSession()

  // prompts user to sign message with wallet, then authenticates signature
  async function handleLogin(e: any) {
    e.preventDefault()
    if (!isConnected || !address || !activeChain) {
      console.warn('HomePage - handleLogin() called with no wallet connected')
      return
    }

    // create message for user to sign
    const message = new SiweMessage({
      domain: window.location.host,
      address,
      statement: 'Sign in with Ethereum',
      uri: window.location.origin,
      version: '1',
      chainId: activeChain.id,
      nonce: await getCsrfToken(),
    })

    // sign message with wallet
    const signature = await signMessageAsync({
      message: message.prepareMessage(),
    })

    // authenticate signature
    signIn('credentials', {
      message: JSON.stringify(message),
      signature,
      redirect: false,
    })
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
            logged in as:
            <small>
              <pre>{JSON.stringify(session, null, 2)}</pre>
            </small>
            <button onClick={handleLogout}>logout</button>
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
