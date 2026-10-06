import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { migrate } from '../migrate.js';
import { createRepository } from '../db.js';

test('real PostgreSQL: concurrent quotas, IP bypass, transactional outbox, sessions and durable logs',{skip:!process.env.TEST_DATABASE_URL},async()=>{
  const admin=new pg.Pool({connectionString:process.env.TEST_DATABASE_URL,max:1});
  const schema=`portfolio_test_${randomUUID().replaceAll('-','')}`;
  await admin.query(`CREATE SCHEMA "${schema}"`);
  const migrationOwnerRole=process.env.TEST_SCHEMA_OWNER_ROLE;
  if (migrationOwnerRole) {
    if (!/^portfolio_owner_[a-z0-9_]+$/.test(migrationOwnerRole)) throw new Error('Invalid TEST_SCHEMA_OWNER_ROLE.');
    await admin.query(`GRANT USAGE, CREATE ON SCHEMA "${schema}" TO "${migrationOwnerRole}"`);
  }
  const pool=new pg.Pool({connectionString:process.env.TEST_DATABASE_URL,max:5,options:`-c search_path=${schema}`});
  try {
    await migrate(pool);
    await migrate(pool); // Idempotent versioned migration.
    const config={sessionSeconds:60,chatTimeoutMs:30000,chatDailySession:2,chatDailyIp:2,chatIpConcurrency:2,chatGlobalConcurrency:5};
    const repo=createRepository(pool,config);
    const results=await Promise.allSettled([repo.reserveChat('session-one','ip1'),repo.reserveChat('session-one','ip1')]);
    assert.equal(results.filter(result=>result.status==='fulfilled').length,1);
    assert.equal(results.find(result=>result.status==='rejected').reason.status,429);
    const reservation=results.find(result=>result.status==='fulfilled').value;
    await repo.completeChat(reservation,{sessionId:'session-one',message:'question',answer:'answer'});
    const second=await repo.reserveChat('session-two','ip1');
    await repo.failChat(second);
    await assert.rejects(repo.reserveChat('session-three','ip1'),error=>error.status===429); // Session ID changes cannot evade server IP quota.
    assert.deepEqual(await repo.history('session-one'),[{role:'user',content:'question'},{role:'assistant',content:'answer'}]);
    assert.equal((await repo.interactions()).length,1);
    await repo.markRead('session-one');assert.equal((await repo.interactions())[0].is_read,true);
    await repo.newsletter('New subscriber','subscriber@example.com');
    await assert.rejects(repo.newsletter('Duplicate','subscriber@example.com'),error=>error.code==='23505');
    assert.equal((await pool.query('SELECT count(*)::int AS count FROM newsletter_outbox')).rows[0].count,1);
    const event=await repo.claimNewsletterEvent();
    assert.equal(event.attempts,1);
    assert.equal(event.payload.record.email,'subscriber@example.com');
    await repo.finishNewsletterEvent(event,{delivered:true,status:200});
    assert.equal((await pool.query('SELECT delivered_at IS NOT NULL AS delivered FROM newsletter_outbox WHERE id=$1',[event.id])).rows[0].delivered,true);
    assert.equal(await repo.claimNewsletterEvent(),null);
    // Importing old subscribers directly never creates welcome events.
    await pool.query("INSERT INTO newsletter_subscribers(email) VALUES('imported@example.com')");
    assert.equal((await pool.query('SELECT count(*)::int AS count FROM newsletter_outbox')).rows[0].count,1);
    // Force a rollback after subscriber insertion, proving no partial transaction.
    await pool.query("ALTER TABLE newsletter_outbox ADD CONSTRAINT reject_test CHECK ((payload->'record'->>'email')!='rollback@example.com')");
    await assert.rejects(repo.newsletter('Rollback','rollback@example.com'));
    assert.equal((await pool.query("SELECT count(*)::int AS count FROM newsletter_subscribers WHERE email='rollback@example.com'")).rows[0].count,0);
    const uid=randomUUID();
    await pool.query('INSERT INTO app_users(id,email,password_hash) VALUES($1,$2,$3)',[uid,'admin@example.com','not-a-real-hash']);
    await pool.query("INSERT INTO profiles(id,role,is_admin) VALUES($1,'admin',true)",[uid]);
    await repo.createSession('hash',uid);assert.equal((await repo.session('hash')).id,uid);
    await pool.query("UPDATE app_sessions SET expires_at=now()-interval '1 second'");assert.equal(await repo.session('hash'),undefined);
    await repo.revokeSession('hash');
    await assert.rejects(repo.completeChat(reservation,{sessionId:'session-one',message:'duplicate',answer:'duplicate'}));
    assert.equal((await repo.interactions()).length,1);
    // Minute rate UPSERT is atomic across separate clients.
    const rates=await Promise.allSettled(Array.from({length:10},()=>repo.rate('parallel',60,3)));
    assert.equal(rates.filter(result=>result.status==='fulfilled').length,3);
    assert.equal(rates.filter(result=>result.status==='rejected').length,7);
  } finally {await pool.end();await admin.query(`DROP SCHEMA "${schema}" CASCADE`);await admin.end();}
});
