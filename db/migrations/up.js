require('dotenv').config()
const postgres = require('postgres')

const { DATABASE_URL } = process.env
if (DATABASE_URL === undefined) throw Error('DATABASE_URL undefined in .env')
const sql = postgres(DATABASE_URL)

const main = async () => {
  try {
    console.log('migrating up...')

    await sql`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY NOT NULL,
        text TEXT NOT NULL,
        done BOOLEAN NOT NULL DEFAULT FALSE
      )
    `

    console.log('migration complete!')
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit()
  }
}

main()
