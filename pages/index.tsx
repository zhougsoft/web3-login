import { useState, useEffect } from 'react'
import type { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { getCsrfToken, useSession, signIn, signOut } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import type Profile from '../interfaces/Profile'
import { useWeb3 } from '../hooks/useWeb3'

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% HomePage
export default function HomePage() {
  // ============================================================================ state
  const {
    isConnected,
    address,
    activeChain,
    connectors,
    pendingConnector,
    connect,
    disconnect,
    signMessageAsync,
  } = useWeb3()
  const { data: session } = useSession()

  const [profile, setProfile] = useState<Profile | undefined>()

  const [isBusy, setIsBusy] = useState<boolean>(false)

  // ============================================================================ data fetching

  // fetch profile via Ethereum address
  async function fetchProfile(address: string) {
    try {
      setIsBusy(true)
      const { data, error } = await fetch(`/api/profile/${address}`, {
        cache: 'no-cache',
      }).then(res => res.json())
      if (error) throw Error(error)

      setProfile(data)
      setIsBusy(false)
    } catch (error) {
      console.error(error)
      setIsBusy(false)
    }
  }

  // fetch all existing profiles on page load
  useEffect(() => {
    if (address !== undefined) {
      fetchProfile(address)
    }
  }, [address])

  // ============================================================================ render logic

  // handles wallet connection buttons & connection flow
  const renderConnectWallet = () => {
    // is loading/not ready
    if (isBusy || !connect) return <em>busy...</em>

    // no wallet connected
    if (!isConnected && connect) {
      return (
        <>
          {connectors.map(connector => (
            <button
              disabled={!connector.ready}
              key={connector.id}
              onClick={() => connect({ connector })}
            >
              {connector.name.toLowerCase()}
              {!connector.ready && ' (unsupported)'}
              {isBusy &&
                connector.id === pendingConnector?.id &&
                ' (connecting)'}
            </button>
          ))}
        </>
      )
    }

    // wallet is connected
    if (isConnected && address) {
      return (
        <>
          <button onClick={() => disconnect()}>disconnect</button>
          {' ~ '}
          <span>
            <em>connected: {address}</em>
          </span>
        </>
      )
    }
  }

  // ============================================================================ render
  return (
    <div>
      {renderConnectWallet()}
      <h1>home</h1>
      <Link href='/profile'>go to your profile</Link>
      <hr />
      <p>a simple web3 login with user profiles</p>
    </div>
  )
} // end HomePage()

// ============================================================================ getServerSideProps
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
} // end getServerSideProps
