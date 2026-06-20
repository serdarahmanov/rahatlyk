import pg from 'pg'

const { Pool } = pg

async function migrate() {
  const connectionString = process.env.DATABASE_URI
  if (!connectionString) throw new Error('DATABASE_URI not set — run with --env-file=.env.local')

  const pool = new Pool({ connectionString })
  const client = await pool.connect()

  try {
    await client.query(`
      ALTER TABLE "articles_body_locales"
      ALTER COLUMN "text" SET DATA TYPE jsonb
      USING jsonb_build_object(
        'root', jsonb_build_object(
          'type',      'root',
          'version',   1,
          'direction', 'ltr',
          'format',    '',
          'indent',    0,
          'children',  jsonb_build_array(
            jsonb_build_object(
              'type',      'paragraph',
              'version',   1,
              'direction', 'ltr',
              'format',    '',
              'indent',    0,
              'children',  jsonb_build_array(
                jsonb_build_object(
                  'type',    'text',
                  'version', 1,
                  'text',    "text",
                  'format',  0,
                  'detail',  0,
                  'mode',    'normal',
                  'style',   ''
                )
              )
            )
          )
        )
      )
    `)
    console.log('Migration complete — articles_body_locales.text is now jsonb.')
  } finally {
    client.release()
    await pool.end()
  }
}

migrate().catch((err) => {
  console.error(err)
  process.exit(1)
})
