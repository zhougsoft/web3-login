import { useState } from 'react'
import { SiweMessage } from 'siwe'
import { useSignMessage } from 'wagmi'

export function useAuth() {
  const { signMessageAsync } = useSignMessage()
  const [loggedInAddress, setLoggedInAddress] = useState<string | undefined>()
  const [isBusy, setIsBusy] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>()

  // fetch unique nonce from the server
  async function getNonce(): Promise<string | undefined> {
    try {
      const nonce = await fetch('/api/nonce').then(res => res.text())
      return nonce
    } catch (error) {
      setError(error as Error)
      setIsBusy(false)
    }
  }

  // fetch current active user from the server
  async function getLoggedInAddress(): Promise<string | undefined> {
    try {
      const result = await fetch('/api/me').then(res => res.json())
      return result.address
    } catch (error) {
      setError(error as Error)
      setIsBusy(false)
    }
  }

  // fetch current active logged in user from server and store in state, overwriting any existing address
  async function refreshLoggedInAddress() {
    setLoggedInAddress(await getLoggedInAddress())
  }

  // sign nonce and verify with server to create an authenticated session
  async function login(address: string, chainId: number) {
    try {
      if (!address || chainId === undefined) throw Error('invalid login() args')

      // fetch fresh nonce from server
      setIsBusy(true)
      const nonce = await getNonce()
      if (!nonce) throw Error('error fetching nonce')

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
      setLoggedInAddress(address)
      setIsBusy(false)
    } catch (error: any) {
      // if the error is not user rejecting connection request, trigger error
      if (error.code !== 4001) {
        setError(error as Error)
      }
      setIsBusy(false)
    }
  } // end login()

  // clears user session and logged in address from state
  const logout = async () => {
    await fetch('/api/logout')
    setLoggedInAddress(undefined)
  }

  return {
    login,
    logout,
    loggedInAddress,
    refreshLoggedInAddress,
    error,
    isBusy,
  }
}
