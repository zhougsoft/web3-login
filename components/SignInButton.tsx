import { useState, useEffect } from 'react'
import { SiweMessage } from 'siwe'
import { useWeb3 } from '../hooks/useWeb3'

interface SignInButtonProps {
  onSuccess: (args: { loggedInAddress: string }) => void
  onError: (args: { error: Error }) => void
}

interface SignInButtonState {
  loading?: boolean
  nonce?: string
}

export default function SignInButton({
  onSuccess,
  onError,
}: SignInButtonProps) {
  const { address, activeChain, signMessageAsync } = useWeb3()

  const [state, setState] = useState<SignInButtonState>({})

  const fetchNonce = async () => {
    try {
      const nonceRes = await fetch('/api/nonce')
      const nonce = await nonceRes.text()
      setState(x => ({ ...x, nonce }))
    } catch (error) {
      setState(x => ({ ...x, error: error as Error }))
    }
  }

  // Pre-fetch random nonce when button is rendered
  // to ensure deep linking works for WalletConnect
  // users on iOS when signing the SIWE message
  useEffect(() => {
    fetchNonce()
  }, [])

  const signIn = async () => {
    try {
      const chainId = activeChain?.id
      if (!address || !chainId) return

      setState(x => ({ ...x, loading: true }))
      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce: state.nonce,
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })

      // Verify signature
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      })
      if (!verifyRes.ok) throw new Error('Error verifying message')

      setState(x => ({ ...x, loading: false }))
      onSuccess({ loggedInAddress: address })
    } catch (error) {
      setState(x => ({ ...x, loading: false, nonce: undefined }))
      onError({ error: error as Error })
      fetchNonce()
    }
  }

  return (
    <button disabled={!state.nonce || state.loading} onClick={signIn}>
      {state.loading ? 'busy...' : 'log in with wallet'}
    </button>
  )
}
