import { useState, useEffect } from 'react'
import Link from 'next/link'
import type Profile from '../interfaces/Profile'
import { useWeb3, useAuth } from '../hooks'
import ConnectWallet from '../components/ConnectWallet'

export default function ProfilePage() {
  // ================================================================================== state
  const { isConnected, address } = useWeb3()
  const { session, signIn, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | undefined>()
  const [statusInput, setStatusInput] = useState<string>('')
  const [isBusy, setIsBusy] = useState<boolean>(false)

  // ================================================================================== data fetching
  // fetch profile via Ethereum address
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
  async function handleUpdateStatusSubmit(e: any) {
    try {
      e.preventDefault()
      // only run if wallet is connected, user is authenticated and there is input in the status field
      if (!isConnected || !address || !session || !statusInput) {
        return
      }
      setIsBusy(true)

      // fetch user's up-to-date profile record
      await fetchProfile(address)

      // either update existing profile, or create new profile if one doesn't exist for address
      await fetch('/api/profile', {
        method: profile ? 'PUT' : 'POST',
        body: JSON.stringify({ address, status: statusInput }),
      }).then(res => res.json())

      setIsBusy(false)

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
    if (address && !session) {
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
            <em>logged in as:</em> <strong>{session.address}</strong>
          </p>
          <form onSubmit={handleUpdateStatusSubmit}>
            <input type='text' onChange={e => setStatusInput(e.target.value)} />
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
      <div>
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
      </div>
      <Link href='/'>back home</Link>
      <hr />
      {renderProfileControls()}
    </>
  )
}
