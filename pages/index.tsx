// next-auth + siwe example:
// https://github.com/spruceid/siwe-next-auth-example

// TODO:
// user account details page
// shows account of connected wallet
// allow user to edit "current vibe" (auth-gated + DB required to persist data)

import type { GetServerSidePropsContext } from 'next'
import { getCsrfToken, useSession, signIn, signOut } from 'next-auth/react'

export default function HomePage() {




  // REQUIRE:
  // web3 stuff - account etc
  // session info
  const { data: session } = useSession()





  async function handleLogin(e: any) {
    e.preventDefault()

    // wallet connected?
    // no - connect wallet, continue

    // sign message

    // send auth req

    // get results

    // update ui
  }







  async function handleLogout(e: any) {
    e.preventDefault()
    signOut()
  }





  

  // if session exists, display account & logout button
  if (session) {
    return (
      <>
        <div>Signed in as {session?.user?.email}</div>
        <button onClick={handleLogout}>logout</button>
      </>
    )
  }
  // no session, display login button
  return (
    <>
      <div>not logged in</div>
      <button onClick={handleLogin}>login</button>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  }
}
