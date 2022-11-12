import Link from 'next/link'
import Thing from '../Thing'

async function getThing(thingId: string): Promise<any> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${thingId}`,
    {
      next: { revalidate: 10 },
    }
  )
  const data = await res.json()
  return data
}

export default async function ThingPage({ params: { id } }: any) {
  // handle trash input
  if (id === undefined || isNaN(id)) {
    console.log('invalid id')
    return <h1>error...</h1>
  }

  const thing = await getThing(id)
  return (
    <>
      <h1>{`thing ${id}`}</h1>
      <Link href='/'>back home</Link>
      <br />
      <Link href='/things'>back to all things</Link>
      <Thing thing={thing} />
    </>
  )
}
