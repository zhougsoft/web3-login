const { commonSql } = require('./utils/common-sql')

commonSql(async sql => {
  await sql`
    CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY NOT NULL,
      status TEXT
    )
  `
})
