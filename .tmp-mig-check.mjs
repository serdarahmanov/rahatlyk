import pg from 'pg'
const pool = new pg.Pool({ connectionString: 'postgresql://rahatlyk:sarwan123@localhost:5432/rahatlyk-website-db' })
try {
  const c = await pool.query("select column_name,data_type from information_schema.columns where table_schema='public' and table_name='payload_migrations' order by ordinal_position")
  const d = await pool.query('select * from payload_migrations')
  console.log(c.rows)
  console.log(d.rows)
} finally { await pool.end() }
