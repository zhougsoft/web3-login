import { useState, useEffect } from 'react'
import type { GetServerSidePropsContext } from 'next'
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
  const [statusInput, setStatusInput] = useState<string>('')
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

      setProfile(data[0])
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

  // ============================================================================ event handlers

  // prompts user to sign message with wallet, then authenticates signature
  async function handleLogin(e: any) {
    try {
      e.preventDefault()
      if (!isConnected || !address || !activeChain) {
        console.warn(
          'WARNING: HomePage - handleLogin() was called with no wallet connected'
        )
        return
      }
      setIsBusy(true)

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

      setIsBusy(false)
    } catch (error: any) {
      // if user rejects login signature, exit silently
      if (error.code === 'ACTION_REJECTED') {
        setIsBusy(false)
        return
      }

      console.error(error)
      alert('error signing the message!\ncheck the browser console...')
    }
  }

  // when user takes action to end the session
  async function handleLogout(e: any) {
    e.preventDefault()
    signOut()
  }

  // update profile record with current input values
  async function handleUpdateStatusSubmit(e: any) {
    try {
      e.preventDefault()
      // only run if wallet is connected, user is authenticated and there is input in the status field
      if (!isConnected || !address || !session || !statusInput) {
        return
      }
      setIsBusy(true)

      // fetch user's up-to-date profile record
      await fetchProfile(address)

      // either update existing profile, or create new profile if one doesn't exist for address
      await fetch('/api/profile', {
        method: profile ? 'PUT' : 'POST',
        body: JSON.stringify({ address, status: statusInput }),
      }).then(res => res.json())

      setIsBusy(false)
      // TODO: update UI more elegantly than force-refreshing the page
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  // ============================================================================ render logic

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
            {isBusy && connector.id === pendingConnector?.id && ' (connecting)'}
          </button>
        ))}
      </>
    )
  }

  // wallet is connected
  if (isConnected && address) {
    return (
      <>
        <div>
          <span>
            <em>connected:</em> {address} {profile ? <>☑</> : <></>}
          </span>
          <br />
          <span>
            status: <em>{profile?.status || 'no status...'}</em>
          </span>
        </div>

        {/*  if session exists, display profile controls & logout button */}
        {/*  else, display login & disconnect button */}
        {session ? (
          <>
            <hr />
            <form onSubmit={handleUpdateStatusSubmit}>
              <input
                type='text'
                onChange={e => setStatusInput(e.target.value)}
              />
              <button type='submit'>
                <strong>update status</strong>
              </button>
            </form>
            <br />
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <>
            <button onClick={() => disconnect()}>disconnect</button>
            <button onClick={handleLogin}>login</button>
          </>
        )}
      </>
    )
  }
} // end HomePage

// ============================================================================ getServerSideProps
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
} // end getServerSideProps
