import { useAccount, useConnect, useDisconnect, useEnsName } from 'wagmi'

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })

  if (isConnected) {
    return (
      <div>
        connected: {address}
        <br />
        ens: {ensName ? ensName : '...'}
        <br />
        <button onClick={() => disconnect()}>disconnect</button>
      </div>
    )
  }

  return (
    <div>
      connect wallet
      <br />
      {connectors.map(connector => (
        <button key={connector.id} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      ))}
    </div>
  )
}
