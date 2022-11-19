const { withSql } = require('./utils/with-sql')

withSql(async sql => {
  console.log('migrating db up...')

  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY NOT NULL,
        status TEXT
    )
  `

  console.log('complete!')
})
