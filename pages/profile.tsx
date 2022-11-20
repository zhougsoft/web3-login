import Link from 'next/link'

export default function ProfilePage() {
  return (
    <>
      <h1>profile page</h1>
      <Link href='/'>home</Link>
      <hr />
      <pre>{JSON.stringify('TODO', null, 2)}</pre>
    </>
  )
}
