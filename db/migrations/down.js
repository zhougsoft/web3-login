require('dotenv').config()
const postgres = require('postgres')

const { DATABASE_URL } = process.env
if (DATABASE_URL === undefined) throw Error('DATABASE_URL undefined in .env')
const sql = postgres(DATABASE_URL)

const main = async () => {
  try {
    console.log('migrating down...')

    await sql`
      DROP TABLE IF EXISTS todos
    `

    console.log('migration complete!')
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit()
  }
}

main()
