import Link from 'next/link'
import Thing from './Thing'
import styles from './things.module.css'

async function getThings(): Promise<any[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    cache: 'no-store', // if this option is not added, this page will be treated like a static page and not re-fetch data on every request
  })
  const data = await res.json()
  return data
}

export default async function ThingsPage() {
  const things = await getThings()
  return (
    <>
      <h1>all things</h1>
      <Link href='/'>back home</Link>

      {things.map((thing: any) => (
        <Thing key={`thing-${Math.random()}`} thing={thing} />
      ))}
    </>
  )
}
