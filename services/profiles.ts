import sql from '../db'
import type Profile from '../interfaces/Profile'

export async function create(profile: Profile) {
  return await sql<Profile[]>`
    INSERT INTO profiles (address, status) VALUES (${profile.address}, ${profile.status})
    RETURNING *
  `
}

export async function read(address: string) {
  return await sql<Profile[]>`
    SELECT DISTINCT * FROM profiles WHERE address=${address} ORDER BY address
  `
}

export async function readAll() {
  return await sql<Profile[]>`SELECT * FROM profiles ORDER BY address`
}

export async function update(profile: Profile) {
  return await sql<Profile[]>`
    UPDATE profiles SET status=${profile.status} WHERE address=${profile.address}
    RETURNING *
  `
}

export async function del(profile: Profile) {
  return await sql<Profile[]>`
    DELETE FROM profiles WHERE address=${profile.address}
    RETURNING *
  `
}
