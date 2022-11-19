import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { Web3Provider } from '../hooks/useWeb3'

export default function App({
  Component,
  pageProps,
}: AppProps<{ session: Session }>) {
  return (
    <Web3Provider>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <Component {...pageProps} />
      </SessionProvider>
    </Web3Provider>
  )
}
