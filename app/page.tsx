import Link from 'next/link'

export default function HomePage() {
  return (
    <div>
      <h1>web3 login with next.js 13</h1>
      <p>
        navigate to the <Link href='/things'>things page</Link> to fetch things
      </p>
      <p>
        navigate to a <Link href='/things/1'>thing page</Link> to fetch a single
        thing based on it's ID
      </p>
      <button>login with wallet</button>
    </div>
  )
}
