const postgres = require('postgres')
require('dotenv').config()

const withSql = async callback => {
  try {
    const { DATABASE_URL } = process.env
    if (DATABASE_URL === undefined) {
      throw Error('DATABASE_URL undefined in .env')
    }
    const sql = postgres(DATABASE_URL)
    await callback(sql)
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit()
  }
}

module.exports = { withSql }
