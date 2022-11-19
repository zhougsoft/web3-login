// common.js implementation of the postgres driver
// for usage with common.js migration scripts

require('dotenv').config()
const postgres = require('postgres')

const { DATABASE_URL } = process.env
if (DATABASE_URL === undefined) throw Error('DATABASE_URL undefined in .env')
const sql = postgres(DATABASE_URL)

exports.commonSql = async callback => {
  try {
    console.log('running migration...')
    await callback(sql)
    console.log('migration complete!')
    process.exit()
  } catch (error) {
    console.error(error)
    process.exit()
  }
}
