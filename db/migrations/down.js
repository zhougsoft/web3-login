const { commonSql } = require('./utils/common-sql')

commonSql(async sql => {
  await sql`DROP TABLE IF EXISTS profiles`
})
