import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'

import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSignMessage,
} from 'wagmi'

import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

interface Web3ProviderProps {
  children?: ReactNode
}

// wrapper for wagmi config provider
export function Web3Provider({ children }: Web3ProviderProps) {
  // setup & detect providers based on credentials in env
  const providers = [publicProvider()]
  const { ALCHEMY_ID, INFURA_ID } = process.env
  if (ALCHEMY_ID) {
    providers.push(alchemyProvider({ apiKey: ALCHEMY_ID }))
  }
  if (INFURA_ID) {
    providers.push(infuraProvider({ apiKey: INFURA_ID }))
  }

  const { chains, provider, webSocketProvider } = configureChains(
    defaultChains,
    providers
  )

  // setup wagmi client with connectors and providers
  const client = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'wagmi',
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: 'Injected',
          shimDisconnect: true,
        },
      }),
    ],
    provider,
    webSocketProvider,
  })

  return <WagmiConfig client={client}>{children}</WagmiConfig>
}

// aggregation of wagmi hooks
export function useWeb3() {
  const { isConnected, address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // will only return *if mounted* so that wallet connection code
  // executes exclusively on the client side, avoiding re-hydration errors
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
