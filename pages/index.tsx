import { useState, useEffect } from 'react'
import { useEnsName } from 'wagmi'
import { useWeb3 } from '../hooks/useWeb3'
import SignInButton from '../components/SignInButton'
import styles from '../styles/main.module.css'

export default function HomePage() {
  const { connect, disconnect, isConnected, address, connectors } = useWeb3()
  const { data: ensName } = useEnsName({ address })

  const [loggedInAddress, setLoggedInAddress] = useState<string | undefined>()
  const [error, setError] = useState<Error | undefined>()
  const [isLoading, setIsLoading] = useState<boolean | undefined>()

  const fetchLoggedInAddress = async () => {
    try {
      setIsLoading(true)
      const result = await fetch('/api/me').then(res => res.json())
      setLoggedInAddress(result.address)
      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    await fetch('/api/logout')
    setLoggedInAddress(undefined)
    setIsLoading(false)
  }

  // fetch active user from backend if:
  useEffect(() => {
    // 1. page loads
    fetchLoggedInAddress()
  }, [])

  // if authenticated, add listener to refetch auth status on focus in case user logs out in a different window
  useEffect(() => {
    if (loggedInAddress !== undefined) {
      window.addEventListener('focus', fetchLoggedInAddress)
      return () => window.removeEventListener('focus', fetchLoggedInAddress)
    }
  }, [loggedInAddress])

  // display UI based on wallet connection & authentication state
  const renderUI = () => {
    if (isLoading) {
      return <div>LOADING...</div>
    }

    // is wallet connected?
    if (isConnected) {
      return (
        <div>
          <ul>
            <li>connected: {address}</li>
            <li>ens: {ensName ? ensName : '...'}</li>
          </ul>
          <button onClick={() => disconnect()}>disconnect</button>
          <hr />
          {/* is logged in? */}
          {loggedInAddress ? (
            <>
              <div>logged in as {loggedInAddress}</div>
              <button onClick={() => handleLogout()}>log out</button>
            </>
          ) : (
            <SignInButton
              onSuccess={({ loggedInAddress }) =>
                setLoggedInAddress(loggedInAddress)
              }
              onError={({ error }) => setError(error)}
            />
          )}
        </div>
      )
    }

    // no wallet connection, is not logged in
    return (
      <div>
        <p>connect wallet</p>
        {connectors?.map(connector => (
          <button key={connector.id} onClick={() => connect({ connector })}>
            {connector.name}
          </button>
        ))}
      </div>
    )
  } // end renderUI()

  return <main className={styles.main}>{renderUI()}</main>
}
