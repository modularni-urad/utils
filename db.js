import knex from 'knex'
import assert from 'assert'

export default async function (migrationDir, opts = null) {
  assert.ok(process.env.DATABASE_URL, 'env.DATABASE_URL not defined!')
  
  opts = opts || {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    debug: process.env.NODE_ENV !== 'production'
  }
  migrationDir && Object.assign(opts, {
    migrations: {
      directory: migrationDir,
      disableMigrationsListValidation: true
    }
  })

  const db = knex(opts)

  migrationDir && await db.migrate.latest()

  return db
}
