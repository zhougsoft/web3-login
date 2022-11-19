import sql from '../db'

export interface Profile {
  id: number
  status: string
}

export async function list() {
  return await sql<Profile[]>`
    SELECT id, status FROM profiles
    ORDER BY id
  `
}

export async function create(profile: Profile) {
  return await sql<Profile[]>`
    INSERT INTO profiles (status) VALUES (${profile.status})
    RETURNING id, status
  `
}

export async function update(profile: Profile) {
  return await sql<Profile[]>`
    UPDATE profiles SET status=${profile.status} WHERE id=${profile.id}
    RETURNING id, status
  `
}

export async function remove(profile: Profile) {
  return await sql<Profile[]>`
    DELETE FROM profiles WHERE id=${profile.id}
    RETURNING id, status
  `
}
