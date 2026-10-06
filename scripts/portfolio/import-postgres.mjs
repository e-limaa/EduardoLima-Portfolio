import { createHash } from 'node:crypto';
import { lstat, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const requireFromServer = createRequire(new URL('../../apps/portfolio/server/package.json', import.meta.url));
const { Pool } = requireFromServer('pg');

const specs = [
  {
    key: 'users',
    table: 'app_users',
    columns: ['id', 'email', 'password_hash', 'created_at', 'email_confirmed_at'],
    updates: ['email', 'password_hash', 'created_at', 'email_confirmed_at'],
    fields: ['id', 'email', 'password_hash', 'created_at', 'email_confirmed_at'],
  },
  {
    key: 'profiles',
    table: 'profiles',
    columns: ['id', 'email', 'role', 'is_admin', 'created_at', 'updated_at'],
    updates: ['email', 'role', 'is_admin', 'created_at', 'updated_at'],
    fields: ['id', 'email', 'role', 'is_admin', 'created_at', 'updated_at'],
  },
  {
    key: 'newsletter_subscribers',
    table: 'newsletter_subscribers',
    columns: ['id', 'created_at', 'name', 'email'],
    updates: ['created_at', 'name', 'email'],
    fields: ['id', 'created_at', 'name', 'email'],
  },
  {
    key: 'interaction_logs',
    table: 'interaction_logs',
    columns: ['id', 'session_id', 'user_message', 'ai_response', 'timestamp', 'is_read'],
    updates: ['session_id', 'user_message', 'ai_response', 'timestamp', 'is_read'],
    fields: ['id', 'session_id', 'user_message', 'ai_response', 'timestamp', 'is_read'],
  },
  {
    key: 'agent_knowledge',
    table: 'agent_knowledge',
    columns: ['id', 'category', 'content', 'metadata', 'created_at'],
    updates: ['category', 'content', 'metadata', 'created_at'],
    fields: ['id', 'category', 'content', 'metadata', 'created_at'],
  },
];

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const bcryptPattern = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
const timestampPattern = /^\d{4}-\d\d-\d\d[T ]\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d(?::?\d\d)?)$/i;
const tableNames = specs.map(({ table }) => table);

class InputError extends Error {}

function usage() {
  console.log('Usage: node scripts/portfolio/import-postgres.mjs --input <0600-json-file> [--env-file <0600-env-file>] [--allow-existing]');
}

function parseArgs(args) {
  const options = { allowExisting: false };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') return { help: true };
    if (arg === '--allow-existing') {
      options.allowExisting = true;
      continue;
    }
    if (arg === '--input' || arg === '--env-file') {
      const value = args[i + 1];
      if (!value || value.startsWith('--')) throw new InputError(`Missing value for ${arg}.`);
      options[arg === '--input' ? 'input' : 'envFile'] = value;
      i += 1;
      continue;
    }
    throw new InputError('Unknown command-line option.');
  }
  if (!options.input) throw new InputError('An input file is required.');
  return options;
}

async function requirePrivateFile(path, label) {
  const info = await lstat(path);
  if (!info.isFile() || info.isSymbolicLink()) throw new InputError(`${label} must be a regular file, not a symlink.`);
  if (process.platform !== 'win32' && (info.mode & 0o077) !== 0) {
    throw new InputError(`${label} permissions must be 0600 or stricter.`);
  }
  return info;
}

async function readDatabaseUrl(envFile) {
  if (!envFile) {
    const value = process.env.DATABASE_URL;
    if (!value) throw new InputError('DATABASE_URL or --env-file is required.');
    return value;
  }

  await requirePrivateFile(envFile, 'Environment file');
  const text = await readFile(envFile, 'utf8');
  const values = new Map();
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const splitAt = line.indexOf('=');
    if (splitAt < 1) throw new InputError('Environment file has an invalid line.');
    const key = line.slice(0, splitAt).trim();
    let value = line.slice(splitAt + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (values.has(key)) throw new InputError('Environment file has a duplicate variable.');
    values.set(key, value);
  }
  const value = values.get('DATABASE_URL');
  if (!value) throw new InputError('DATABASE_URL is missing from the environment file.');
  return value;
}

function failAt(path, reason) {
  throw new InputError(`Invalid ${path}: ${reason}.`);
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function expectKeys(value, expected, path) {
  if (!isRecord(value)) failAt(path, 'expected an object');
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (actual.length !== wanted.length || actual.some((key, index) => key !== wanted[index])) {
    failAt(path, 'fields do not match the import contract');
  }
}

function checkNullableText(value, path) {
  if (value !== null && typeof value !== 'string') failAt(path, 'expected text or null');
}

function checkTimestamp(value, path, nullable = false) {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || !timestampPattern.test(value) || !Number.isFinite(Date.parse(value))) {
    failAt(path, 'expected an ISO timestamp');
  }
}

function checkUuid(value, path) {
  if (typeof value !== 'string' || !uuidPattern.test(value)) failAt(path, 'expected a UUID');
}

function checkEmail(value, path, nullable = false) {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || value.length > 320 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    failAt(path, 'expected an email address');
  }
}

function validateInput(data) {
  expectKeys(data, specs.map(({ key }) => key), 'root');
  const idsByTable = new Map();
  const users = new Set();
  const counts = {};

  for (const spec of specs) {
    const rows = data[spec.key];
    if (!Array.isArray(rows)) failAt(spec.key, 'expected an array');
    counts[spec.key] = rows.length;
    const ids = new Set();
    const emailKeys = new Set();

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const rowPath = `${spec.key}[${index}]`;
      expectKeys(row, spec.fields, rowPath);
      checkUuid(row.id, `${rowPath}.id`);
      const normalizedId = row.id.toLowerCase();
      if (ids.has(normalizedId)) failAt(`${rowPath}.id`, 'duplicate ID');
      ids.add(normalizedId);

      if (spec.key === 'users') {
        checkEmail(row.email, `${rowPath}.email`);
        const normalizedEmail = row.email.toLowerCase();
        if (emailKeys.has(normalizedEmail)) failAt(`${rowPath}.email`, 'duplicate case-insensitive email');
        emailKeys.add(normalizedEmail);
        if (typeof row.password_hash !== 'string' || !bcryptPattern.test(row.password_hash)) {
          failAt(`${rowPath}.password_hash`, 'expected a bcrypt hash');
        }
        checkTimestamp(row.created_at, `${rowPath}.created_at`);
        checkTimestamp(row.email_confirmed_at, `${rowPath}.email_confirmed_at`, true);
        users.add(normalizedId);
      } else if (spec.key === 'profiles') {
        checkEmail(row.email, `${rowPath}.email`, true);
        if (!['user', 'admin', 'owner', 'superadmin'].includes(row.role)) failAt(`${rowPath}.role`, 'role is not allowed');
        if (typeof row.is_admin !== 'boolean') failAt(`${rowPath}.is_admin`, 'expected a boolean');
        checkTimestamp(row.created_at, `${rowPath}.created_at`);
        checkTimestamp(row.updated_at, `${rowPath}.updated_at`);
      } else if (spec.key === 'newsletter_subscribers') {
        checkTimestamp(row.created_at, `${rowPath}.created_at`);
        checkNullableText(row.name, `${rowPath}.name`);
        checkEmail(row.email, `${rowPath}.email`);
        const normalizedEmail = row.email.toLowerCase();
        if (emailKeys.has(normalizedEmail)) failAt(`${rowPath}.email`, 'duplicate case-insensitive email');
        emailKeys.add(normalizedEmail);
      } else if (spec.key === 'interaction_logs') {
        checkNullableText(row.session_id, `${rowPath}.session_id`);
        checkNullableText(row.user_message, `${rowPath}.user_message`);
        checkNullableText(row.ai_response, `${rowPath}.ai_response`);
        checkTimestamp(row.timestamp, `${rowPath}.timestamp`, true);
        if (row.is_read !== null && typeof row.is_read !== 'boolean') failAt(`${rowPath}.is_read`, 'expected a boolean or null');
      } else if (spec.key === 'agent_knowledge') {
        checkNullableText(row.category, `${rowPath}.category`);
        checkNullableText(row.content, `${rowPath}.content`);
        if (row.metadata !== null && row.metadata === undefined) failAt(`${rowPath}.metadata`, 'missing metadata');
        checkTimestamp(row.created_at, `${rowPath}.created_at`);
      }
    }

    idsByTable.set(spec.table, ids);
  }

  for (let index = 0; index < data.profiles.length; index += 1) {
    if (!users.has(data.profiles[index].id.toLowerCase())) failAt(`profiles[${index}].id`, 'user is missing from users');
  }
  if (Object.values(counts).every((count) => count === 0)) failAt('root', 'input contains no rows');

  return { counts, idsByTable };
}

function sqlFor(spec, rows, offset = 0) {
  const values = [];
  const tuples = rows.map((row, rowIndex) => {
    const placeholders = spec.columns.map((column, columnIndex) => {
      const value = column === 'metadata' && row[column] !== null ? JSON.stringify(row[column]) : row[column];
      values.push(value);
      return `$${offset + rowIndex * spec.columns.length + columnIndex + 1}`;
    });
    return `(${placeholders.join(',')})`;
  });
  const updates = spec.updates.map((column) => `${column}=EXCLUDED.${column}`).join(',');
  return {
    text: `INSERT INTO ${spec.table} (${spec.columns.join(',')}) VALUES ${tuples.join(',')} ON CONFLICT (id) DO UPDATE SET ${updates}`,
    values,
  };
}

async function rowCounts(client) {
  const result = {};
  for (const table of tableNames) {
    const count = await client.query(`SELECT count(*)::bigint AS count FROM ${table}`);
    result[table] = Number(count.rows[0].count);
  }
  return result;
}

function validateDatabaseUrl(value) {
  try {
    const parsed = new URL(value);
    if (!['postgres:', 'postgresql:'].includes(parsed.protocol) || !parsed.hostname || !parsed.pathname || parsed.pathname === '/') {
      throw new Error();
    }
  } catch {
    throw new InputError('DATABASE_URL must be a PostgreSQL connection URL.');
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    usage();
    return;
  }

  const inputInfo = await requirePrivateFile(options.input, 'Import file');
  if (inputInfo.size > 100 * 1024 * 1024) throw new InputError('Import file exceeds the 100 MiB safety limit.');
  const inputBytes = await readFile(options.input);
  if (inputBytes.byteLength > 100 * 1024 * 1024) throw new InputError('Import file exceeds the 100 MiB safety limit.');
  let data;
  try {
    data = JSON.parse(inputBytes.toString('utf8'));
  } catch {
    throw new InputError('Import file is not valid UTF-8 JSON.');
  }
  const { counts: sourceCounts, idsByTable } = validateInput(data);
  const databaseUrl = await readDatabaseUrl(options.envFile);
  validateDatabaseUrl(databaseUrl);

  const pool = new Pool({ connectionString: databaseUrl, max: 1, connectionTimeoutMillis: 10000 });
  let client;
  let committed = false;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    const ownerRole = process.env.MIGRATION_OWNER_ROLE;
    if (ownerRole) {
      if (!/^portfolio_owner_[a-z0-9_]+$/.test(ownerRole)) throw new InputError('MIGRATION_OWNER_ROLE is invalid.');
      await client.query(`SET LOCAL ROLE "${ownerRole}"`);
    }
    await client.query(`LOCK TABLE ${tableNames.join(', ')} IN SHARE ROW EXCLUSIVE MODE`);
    const before = await rowCounts(client);
    if (!options.allowExisting && Object.values(before).some((count) => count !== 0)) {
      throw new InputError('Destination tables contain rows. Review them before using the explicit replay option.');
    }

    const preexistingIds = new Map();
    for (const table of tableNames) {
      const existing = await client.query(`SELECT id::text AS id FROM ${table}`);
      preexistingIds.set(table, new Set(existing.rows.map(({ id }) => id.toLowerCase())));
    }

    for (const spec of specs) {
      const rows = [...data[spec.key]].sort((a, b) => a.id.localeCompare(b.id));
      for (let start = 0; start < rows.length; start += 250) {
        const batch = rows.slice(start, start + 250);
        if (batch.length === 0) continue;
        const query = sqlFor(spec, batch);
        await client.query(query.text, query.values);
      }
    }

    const after = await rowCounts(client);
    for (const table of tableNames) {
      const newIds = [...idsByTable.get(table)].filter((id) => !preexistingIds.get(table).has(id)).length;
      if (after[table] !== before[table] + newIds) {
        throw new Error('Post-import count did not match the staged input.');
      }
    }
    await client.query('COMMIT');
    committed = true;

    console.log(JSON.stringify({
      ok: true,
      sourceRows: sourceCounts,
      databaseRows: after,
      inputSha256: createHash('sha256').update(inputBytes).digest('hex'),
      replayMode: options.allowExisting,
    }));
  } catch (error) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    const safeMessage = error instanceof InputError ? error.message : 'database operation failed';
    const code = typeof error?.code === 'string' && /^\d{5}$/.test(error.code) ? ` (PostgreSQL ${error.code})` : '';
    console.error(`Import failed; transaction rolled back: ${safeMessage}${code}`);
    process.exitCode = 1;
  } finally {
    client?.release();
    await pool.end();
  }

  if (!committed && process.exitCode === 0) process.exitCode = 1;
}

main().catch((error) => {
  const safeMessage = error instanceof InputError ? error.message : 'unable to open import inputs';
  console.error(`Import failed before database changes: ${safeMessage}`);
  process.exitCode = 1;
});
