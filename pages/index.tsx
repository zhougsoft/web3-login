import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export default function HomePage() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()

  return (
    <>
      <h1>web3 login</h1>

      {isConnected ? (
        <>
          <button onClick={() => disconnect()}>disconnect</button>
          <div>{`connected: ${address}`}</div>
        </>
      ) : (
        <button onClick={() => connect()}>connect</button>
      )}
    </>
  )
}
