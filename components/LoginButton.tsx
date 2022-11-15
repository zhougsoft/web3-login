import { useState, useEffect } from 'react'
import { SiweMessage } from 'siwe'
import { useWeb3 } from '../hooks/useWeb3'

interface LoginButtonProps {
  onSuccess: (args: { loggedInAddress: string }) => void
  onError: (args: { error: Error }) => void
}

export default function LoginButton({ onSuccess, onError }: LoginButtonProps) {
  const { address, activeChain, signMessageAsync } = useWeb3()

  const [nonce, setNonce] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState<boolean | undefined>()

  // fetch random nonce from server and store in state, overwriting the existing nonce
  const fetchNonce = async () => {
    try {
      const nonce = await fetch('/api/nonce').then(res => res.text())
      setNonce(nonce)
    } catch (error: any) {
      onError({ error })
    }
  }

  const resetLoginState = () => {
    setNonce(undefined)
    fetchNonce()
    setIsLoading(false)
  }

  // handler to reset login state & trigger error handlers if authentication fails
  const handleLoginError = (error: Error) => {
    onError({ error })
    resetLoginState()
  }

  // fetch nonce on render to ensure deep linking works for
  // WalletConnect users on iOS when signing the SIWE message
  useEffect(() => {
    fetchNonce()
  }, [])

  // sign nonce and verify with server to create an authenticated session
  const login = async () => {
    try {
      // abort if invalid wallet connection
      const chainId = activeChain?.id
      if (!address || !chainId) return

      setIsLoading(true)
      // create a SIWE message with the pre-fetched nonce
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'I accept the Terms of Service of this application',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
        resources: ['https://example.com', 'ipfs://69bingbong420'],
      })

      // sign message with connected wallet
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })

      // verify signature with server
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, signature }),
      })
      if (!verifyRes.ok) throw new Error('Error verifying message')

      // verification successful
      setIsLoading(false)
      onSuccess({ loggedInAddress: address })
    } catch (error: any) {
      // if user rejects connection request, revert login & return silently
      if (error.code === 4001) {
        resetLoginState()
        return
      }

      handleLoginError(error as Error)
    }
  }

  return (
    <button disabled={!nonce || isLoading} onClick={login}>
      {isLoading ? 'busy...' : 'log in with wallet'}
    </button>
  )
}
