import { useCallback, useEffect } from 'react'
import { useEnsName } from 'wagmi'
import { useWeb3 } from '../hooks/useWeb3'
import { useAuth } from '../hooks/useAuth'
import styles from '../styles/main.module.css'

export default function HomePage() {
  const { connect, disconnect, isConnected, address, activeChain, connectors } =
    useWeb3()
  const {
    login,
    logout,
    loggedInAddress,
    refreshLoggedInAddress,
    error,
    isBusy,
  } = useAuth()
  const { data: ensName } = useEnsName({ address })

  const handleLogin = useCallback(() => {
    if (address && activeChain) {
      login(address, activeChain.id)
    }
  }, [address, activeChain])

  const handleLogout = async () => {
    await logout()
  }

  // fetch address login state on page load
  useEffect(() => {
    refreshLoggedInAddress()
  }, [])

  // if authenticated, add listener to refetch auth status on focus in case user logs out in a different window
  useEffect(() => {
    if (loggedInAddress !== undefined) {
      window.addEventListener('focus', refreshLoggedInAddress)
      return () => window.removeEventListener('focus', refreshLoggedInAddress)
    }
  }, [loggedInAddress])

  // display UI based on wallet connection & authentication state
  const renderUI = () => {
    if (error) {
      return <div>login error: check console</div>
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

          {/* is user logged in? */}
          {loggedInAddress ? (
            <>
              <ul>
                <li>logged in as {loggedInAddress}</li>
              </ul>
              <button onClick={handleLogout}>log out</button>
            </>
          ) : (
            <button disabled={isBusy} onClick={handleLogin}>
              {isBusy ? 'busy...' : 'log in with wallet'}
            </button>
          )}
        </div>
      )
    }

    // no wallet connection
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
