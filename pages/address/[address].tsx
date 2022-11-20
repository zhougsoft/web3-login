import type { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import type Profile from '../../interfaces/Profile'
import { read as readProfile } from '../../services/profiles'

// a page to view a user's profile via their ethereum address

interface AddressPageProps {
  profile?: Profile
}

export default function AddressPage({ profile }: AddressPageProps) {
  return (
    <>
      <h1>profile page</h1>
      <Link href='/'>home</Link>
      <hr />
      {profile ? (
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      ) : (
        <div>no profile...</div>
      )}
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // validate address route param
  const { params } = context
  if (
    !params ||
    typeof params.address !== 'string' ||
    params.address.length !== 42
  ) {
    return { notFound: true }
  }

  // fetch & return profile record from database if exists
  const [profile] = await readProfile(params.address)
  return { props: { profile: profile || null } }
}
