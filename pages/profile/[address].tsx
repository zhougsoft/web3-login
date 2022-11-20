import type { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import type Profile from '../../interfaces/Profile'
import { read as readProfile } from '../../services/profiles'

interface ProfilePageProps {
  profile: Profile
}

export default function ProfilePage({ profile }: ProfilePageProps) {
  return (
    <>
      <h1>profile page</h1>
      <Link href='/'>home</Link>
      <hr />
      <pre>{JSON.stringify(profile, null, 2)}</pre>
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
  if (!profile) return { notFound: true }
  return { props: { profile } }
}
