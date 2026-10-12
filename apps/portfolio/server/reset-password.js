import { readFile, stat } from 'node:fs/promises';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { transaction } from './db.js';
import { validateEmail } from './security.js';

// Recovery is a protected operator action; no password, hash or recovery token
// appears in arguments, logs or browser endpoints. Remove the file afterward.
// It uses the privileged migration connection: the runtime API role can only
// read app_users and must never be able to change credentials.
if (!process.env.MIGRATION_DATABASE_URL || !process.env.RESET_PASSWORD_FILE) throw new Error('MIGRATION_DATABASE_URL and RESET_PASSWORD_FILE are required.');
const ownerRole=process.env.MIGRATION_OWNER_ROLE;
if (ownerRole && !/^portfolio_owner_[a-z0-9_]+$/.test(ownerRole)) throw new Error('Invalid MIGRATION_OWNER_ROLE.');
const email=validateEmail(process.env.RESET_PASSWORD_EMAIL);
const info=await stat(process.env.RESET_PASSWORD_FILE);
if(process.platform!=='win32' && (info.mode & 0o077)!==0) throw new Error('Password file must have permissions 0600 or stricter.');
const password=(await readFile(process.env.RESET_PASSWORD_FILE,'utf8')).replace(/\r?\n$/,'');
if(password.length<12 || Buffer.byteLength(password,'utf8')>72) throw new Error('New password must have at least 12 characters and at most 72 UTF-8 bytes.');
const hash=await bcrypt.hash(password,12);
const pool=new pg.Pool({connectionString:process.env.MIGRATION_DATABASE_URL,max:1});
try {
  await transaction(pool,async client=>{
    if(ownerRole) await client.query(`SET LOCAL ROLE "${ownerRole}"`);
    const user=(await client.query(`SELECT u.id FROM app_users u JOIN profiles p ON p.id=u.id WHERE lower(u.email)=$1 AND (p.is_admin OR p.role IN ('admin','owner','superadmin')) FOR UPDATE OF u`,[email])).rows[0];
    if(!user) throw new Error('Administrator account not found.');
    await client.query('UPDATE app_users SET password_hash=$2 WHERE id=$1',[user.id,hash]);
    await client.query('DELETE FROM app_sessions WHERE user_id=$1',[user.id]);
  });
  console.log('Administrator password updated and existing sessions revoked.');
} catch(error) {
  // Error messages and SQLSTATE codes never contain the password or its hash.
  console.error(`Password recovery failed: ${error?.message || 'unknown error'}${error?.code ? ` (${error.code})` : ''}`);
  process.exitCode=1;
}
finally {await pool.end();}
