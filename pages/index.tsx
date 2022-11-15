import { useState, useEffect } from 'react'
import { useEnsName } from 'wagmi'
import { useWeb3 } from '../hooks/useWeb3'
import SignInButton from '../components/SignInButton'

interface HomePageState {
  loggedInAddress?: string
  error?: Error
  loading?: boolean
}

export default function HomePage() {
  const { connect, disconnect, isConnected, address, connectors } = useWeb3()
  const { data: ensName } = useEnsName({ address })
  const [state, setState] = useState<HomePageState>({})

  const fetchActiveUser = async () => {
    try {
      const result = await fetch('/api/me').then(res => res.json())
      setState(x => ({ ...x, loggedInAddress: result.address }))
    } catch (error) {
      console.error(error)
    }
  }

  // fetch active user from backend if:
  useEffect(() => {
    // 1. page loads
    fetchActiveUser()

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener('focus', fetchActiveUser)
    return () => window.removeEventListener('focus', fetchActiveUser)
  }, [])

  useEffect(() => {
    console.log({ loggedInAddress: state.loggedInAddress })
  }, [state.loggedInAddress])

  if (isConnected) {
    return (
      <div>
        connected: {address}
        <br />
        ens: {ensName ? ensName : '...'}
        {state.loggedInAddress ? (
          <div>
            <hr />
            <div>logged in as {state.loggedInAddress}</div>
            <button
              onClick={async () => {
                await fetch('/api/logout')
                disconnect()
                setState({})
              }}
            >
              log out
            </button>
          </div>
        ) : (
          <SignInButton
            onSuccess={({ loggedInAddress }) =>
              setState(x => ({ ...x, loggedInAddress }))
            }
            onError={({ error }) => setState(x => ({ ...x, error }))}
          />
        )}
      </div>
    )
  }

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
}
