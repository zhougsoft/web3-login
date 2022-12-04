const { withSql } = require('./utils/with-sql')

withSql(async sql => {
  console.log('migrating db down...')
  
  await sql`DROP INDEX IF EXISTS address_index;`
  await sql`DROP TABLE IF EXISTS profiles;`

  console.log('complete!')
})
