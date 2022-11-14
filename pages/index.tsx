import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'
import { useIsMounted } from '../hooks/useIsMounted'
import SignInButton from '../components/SignInButton'

interface HomePageState {
  loggedInAddress?: string
  error?: Error
  loading?: boolean
}

export default function HomePage() {
  const isMounted = useIsMounted()
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })

  const [state, setState] = useState<HomePageState>({})

  // Fetch user when:
  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch('/api/me')
        const json = await res.json()
        setState(x => ({ ...x, loggedInAddress: json.address }))
      } catch (_error) {}
    }
    // 1. page loads
    handler()

    // 2. window is focused (in case user logs out of another window)
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [])

  // ensure component only executes on the client side to avoid re-hydration error
  if (!isMounted) return <></>

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
      {connectors.map(connector => (
        <button key={connector.id} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      ))}
    </div>
  )
}
