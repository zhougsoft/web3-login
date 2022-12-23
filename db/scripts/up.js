const { withSql } = require('./utils')

withSql(async sql => {
  console.log('migrating db up...')

  // create profiles table
  await sql`
    CREATE TABLE profiles (
        profile_id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        address VARCHAR(42) UNIQUE NOT NULL,
        status TEXT
    )
  `

  // index wallet addresses in profiles table
  await sql`
    CREATE INDEX address_index
    ON profiles(address)
  `

  console.log('complete!')
})
