import knex from 'knex'
import assert from 'assert'
assert.ok(process.env.DATABASE_URL, 'env.DATABASE_URL not defined!')

export default async (migrationDir) => {
  //
  const opts = {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: migrationDir,
      disableMigrationsListValidation: true
    },
    debug: process.env.NODE_ENV === 'debug'
  }

  const db = knex(opts)

  await db.migrate.latest()

  return db
}
