const { withSql } = require('./utils/with-sql')

withSql(async sql => {
  console.log('migrating db up...')

  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
        address VARCHAR(42) UNIQUE NOT NULL,
        status TEXT,
        PRIMARY KEY (address)
    )
  `

  console.log('complete!')
})
