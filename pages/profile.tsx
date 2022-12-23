import { useState, useEffect, useRef, FormEvent } from 'react'
import Link from 'next/link'

import type Profile from '../interfaces/Profile'
import { useWeb3, useAuth } from '../hooks'
import { truncateAddress } from '../utils'
import ConnectWallet from '../components/ConnectWallet'

export default function ProfilePage() {
  // ================================================================================== state
  const { isConnected, address } = useWeb3()
  const { session, signIn, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | undefined>()
  const [isBusy, setIsBusy] = useState<boolean>(false)
  const statusInputRef = useRef<HTMLInputElement>(null)

  // ================================================================================== data fetching
  // fetch profile via an Ethereum address
  async function fetchProfile(address: string) {
    try {
      setIsBusy(true)
      const { data, error } = await fetch(`/api/profile/${address}`).then(res =>
        res.json()
      )
      if (error) throw Error(error)

      setProfile(data)
      setIsBusy(false)
    } catch (error) {
      console.error(error)
      setIsBusy(false)
      alert('error: failed to fetch profile')
    }
  }

  // fetch profile for active connected wallet
  useEffect(() => {
    if (address !== undefined) {
      fetchProfile(address)
    }
  }, [address])

  // ================================================================================== event handlers

  // send API request to update the database with user input
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    try {
      // prevent a postback and grab data from the input
      event.preventDefault()
      const statusInput = statusInputRef?.current?.value

      // abort if wallet is not connected, user is not authenticated or no form input
      if (!isConnected || !address || !session || !statusInput) {
        return
      }

      // fetch user's up-to-date profile record
      setIsBusy(true)
      await fetchProfile(address)

      // either update existing profile, or create new profile if one doesn't exist for address
      await fetch('/api/profile', {
        method: profile ? 'PUT' : 'POST',
        body: JSON.stringify({ address, status: statusInput }),
      }).then(res => res.json())

      // force a post-back to fetch and display the updated data
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  // ================================================================================== profile controls logic

  const renderProfileControls = () => {
    if (isBusy) return <em>busy...</em>

    // if wallet not connected, show prompt to connect
    if (!address) return <div>connect wallet to see profile...</div>

    // if wallet connected but not logged in, show login button
    if (address && !session?.address) {
      return (
        <>
          <button onClick={() => signIn()}>login to edit status</button>
        </>
      )
    }

    // if session exists, display edit profile link & logout button
    if (session && session.address === address) {
      return (
        <>
          <p>
            <em>logged in as:</em>{' '}
            <strong>{truncateAddress(session.address)}</strong>
          </p>
          <form onSubmit={handleSubmit}>
            <input type='text' ref={statusInputRef} />
            <button type='submit'>
              <strong>update status</strong>
            </button>
          </form>
          <br />
          <button onClick={() => signOut()}>logout</button>
        </>
      )
    }

    // return null component as a catch-all case
    return <></>
  }

  // ================================================================================= page render
  return (
    <>
      <ConnectWallet />
      <>
        <h1>profile</h1>
        {address && profile?.status ? (
          <p>
            <em>
              ~ status: <strong>"{profile.status}"</strong>
            </em>
          </p>
        ) : (
          <></>
        )}
      </>
      <Link href='/'>back home</Link>
      <hr />
      {renderProfileControls()}
    </>
  )
}
