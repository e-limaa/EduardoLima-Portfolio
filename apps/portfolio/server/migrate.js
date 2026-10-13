import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { createHash } from 'node:crypto';

export async function migrate(pool) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (process.env.MIGRATION_OWNER_ROLE) {
      if (!/^portfolio_owner_[a-z0-9_]+$/.test(process.env.MIGRATION_OWNER_ROLE)) throw new Error('Invalid MIGRATION_OWNER_ROLE.');
      await client.query(`SET LOCAL ROLE "${process.env.MIGRATION_OWNER_ROLE}"`);
    }
    await client.query('SELECT pg_advisory_xact_lock(79133219)');
    await client.query('CREATE TABLE IF NOT EXISTS app_schema_migrations(version text PRIMARY KEY,checksum text NOT NULL,applied_at timestamptz NOT NULL DEFAULT now())');
    for (const file of (await readdir(new URL('./migrations/',import.meta.url))).filter(name=>name.endsWith('.sql')).sort()) {
      const sql = await readFile(new URL(`./migrations/${file}`,import.meta.url),'utf8');
      const checksum = createHash('sha256').update(sql).digest('hex');
      const existing = (await client.query('SELECT checksum FROM app_schema_migrations WHERE version=$1',[file])).rows[0];
      if (existing && existing.checksum!==checksum) throw new Error(`Changed applied migration: ${file}`);
      if (!existing) { await client.query(sql); await client.query('INSERT INTO app_schema_migrations(version,checksum) VALUES($1,$2)',[file,checksum]); }
    }
    await client.query('COMMIT');
  } catch(error) { await client.query('ROLLBACK').catch(()=>{}); throw error; }
  finally { client.release(); }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!process.env.MIGRATION_DATABASE_URL) throw new Error('MIGRATION_DATABASE_URL is required (DDL owner connection, separate from runtime).');
  const pool = new pg.Pool({connectionString:process.env.MIGRATION_DATABASE_URL,max:1});
  try { await migrate(pool); console.log('Application migrations applied.'); }
  catch(error) { console.error(`Migration failed: ${error?.message || 'unknown error'}${error?.code ? ` (${error.code})` : ''}. Verify database state and privileges.`); process.exitCode=1; }
  finally { await pool.end(); }
}
