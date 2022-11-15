import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSignMessage,
} from 'wagmi'
import { useIsMounted } from './useIsMounted'

// aggregation of the wagmi hook results
export function useWeb3() {
  const { isConnected, address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const { connectors, connect } = useConnect()
  const isMounted = useIsMounted()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

  // ensure wallet connection code only executes on the client side to avoid re-hydration error
  return isMounted
    ? {
        isConnected,
        address,
        activeChain,
        connectors,
        connect,
        disconnect,
        signMessageAsync,
      }
    : {}
}
