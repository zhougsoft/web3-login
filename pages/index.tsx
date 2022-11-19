import { useState } from 'react'
import type { GetServerSidePropsContext } from 'next'
import { getCsrfToken, useSession, signIn, signOut } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useWeb3 } from '../hooks/useWeb3'

const PROTECTED_ROUTE = '/api/magic-thing'

export default function HomePage() {
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
  const [isBusy, setIsBusy] = useState<boolean>(false)

  // "magic thing" represents an action that requires user authentication!
  async function handleMagicThing() {
    try {
      console.log('requesting magic thing...')
      setIsBusy(true)

      const { data, error } = await fetch(PROTECTED_ROUTE).then(res =>
        res.json()
      )

      if (error) {
        console.warn(error)
        alert(error)
        setIsBusy(false)
        return
      }

      console.log('success!', { data })
      alert(data)

      setIsBusy(false)
    } catch (error) {
      console.error(error)
      alert('error fetching the magic thing!\ncheck the browser console...')
    }
  }

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
          <em>connected:</em> {address}
        </div>
        <button onClick={() => disconnect()}>disconnect</button>
        {/*  if session exists, display info & logout button */}
        {/*  else, display login button */}
        {session ? (
          <>
            <hr />
            <em>logged in as:</em>
            <small>
              <pre>{JSON.stringify(session, null, 2)}</pre>
            </small>
            <button onClick={handleMagicThing}>
              <strong>do magic thing</strong>
            </button>
            {' | '}
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <>
            <button onClick={handleLogin}>login</button>
            <button onClick={handleMagicThing}>
              <em>try magic thing {';)'}</em>
            </button>
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
