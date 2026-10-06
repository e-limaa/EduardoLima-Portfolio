import pg from 'pg';
import { HttpError } from './security.js';

export function createPool(config) {
  const pool = new pg.Pool({connectionString: config.databaseUrl, max: config.poolMax, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000, statement_timeout: 10000, application_name: 'portfolio-api'});
  pool.on('error', () => console.error('[database] idle connection failure'));
  return pool;
}
export async function transaction(pool, work) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally { client.release(); }
}
export async function consumeRate(pool, scope, seconds, limit) {
  const result = await pool.query(`INSERT INTO app_rate_limits(scope,window_start,used)
    VALUES($1,to_timestamp(floor(extract(epoch FROM now())/$2)*$2),1)
    ON CONFLICT(scope,window_start) DO UPDATE SET used=app_rate_limits.used+1
    WHERE app_rate_limits.used < $3 RETURNING used`, [scope,seconds,limit]);
  if (!result.rowCount) throw new HttpError(429, 'Muitas tentativas. Tente novamente mais tarde.');
}
export function createRepository(pool, config) {
  return {
    pool,
    health: async () => { await pool.query('SELECT 1'); },
    rate: (scope,seconds,limit) => consumeRate(pool,scope,seconds,limit),
    findUser: async email => (await pool.query(`SELECT u.id,u.email,u.password_hash,p.role,p.is_admin FROM app_users u LEFT JOIN profiles p ON p.id=u.id WHERE lower(u.email)=$1`,[email])).rows[0],
    session: async hash => (await pool.query(`SELECT u.id,u.email,p.role,p.is_admin FROM app_sessions s JOIN app_users u ON u.id=s.user_id LEFT JOIN profiles p ON p.id=u.id WHERE s.token_hash=$1 AND s.expires_at>now()`,[hash])).rows[0],
    createSession: async (hash,userId) => pool.query(`INSERT INTO app_sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+$3*interval '1 second')`,[hash,userId,config.sessionSeconds]),
    revokeSession: async hash => pool.query('DELETE FROM app_sessions WHERE token_hash=$1',[hash]),
    interactions: async () => (await pool.query('SELECT id,session_id,user_message,ai_response,timestamp,is_read FROM interaction_logs ORDER BY timestamp DESC NULLS LAST,id DESC')).rows,
    markRead: async id => pool.query('UPDATE interaction_logs SET is_read=true WHERE session_id=$1',[id]),
    newsletter: async (name,email) => transaction(pool, async client => {
      const subscriber = (await client.query('INSERT INTO newsletter_subscribers(name,email) VALUES($1,$2) RETURNING *',[name,email])).rows[0];
      // Import writes directly to the table and never produces welcome events.
      await client.query(`INSERT INTO newsletter_outbox(subscriber_id,payload) VALUES($1,$2::jsonb)`,[subscriber.id,JSON.stringify({type:'INSERT',table:'newsletter_subscribers',schema:'public',record:subscriber,old_record:null})]);
      return subscriber;
    }),
    claimNewsletterEvent: async () => transaction(pool, async client => {
      const event = (await client.query(`SELECT id,payload,attempts FROM newsletter_outbox
        WHERE delivered_at IS NULL AND next_attempt_at<=now()
        ORDER BY created_at,id LIMIT 1 FOR UPDATE SKIP LOCKED`)).rows[0];
      if (!event) return null;
      const leased = (await client.query(`UPDATE newsletter_outbox
        SET attempts=attempts+1,next_attempt_at=now()+interval '2 minutes'
        WHERE id=$1 AND delivered_at IS NULL RETURNING id,payload,attempts`,[event.id])).rows[0];
      return leased || null;
    }),
    finishNewsletterEvent: async (event,{delivered,status}) => {
      if (delivered) return pool.query(`UPDATE newsletter_outbox SET delivered_at=now(),last_error=NULL
        WHERE id=$1 AND attempts=$2 AND delivered_at IS NULL`,[event.id,event.attempts]);
      const safeError = Number.isInteger(status) && status>=100 && status<=599 ? `HTTP ${status}` : 'Network failure';
      return pool.query(`UPDATE newsletter_outbox
        SET last_error=$3,next_attempt_at=now()+LEAST(power(2,LEAST(attempts,8))*interval '1 minute',interval '6 hours')
        WHERE id=$1 AND attempts=$2 AND delivered_at IS NULL`,[event.id,event.attempts,safeError]);
    },
    reserveChat: async (sessionId,ipHash) => transaction(pool, async client => {
      // A global transaction lock serializes quota checks, including simultaneous
      // requests in separate processes. It is released before any network/AI work.
      await client.query("SELECT pg_advisory_xact_lock(79133218)");
      await client.query("UPDATE chat_reservations SET status='expired' WHERE status='reserved' AND expires_at <= now()");
      const usage = (await client.query(`SELECT
        (SELECT count(*) FROM interaction_logs WHERE session_id=$1 AND timestamp >= date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC') +
        (SELECT count(*) FROM chat_reservations WHERE session_id=$1 AND created_at >= date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC' AND status!='completed') AS session_used,
        count(*) FILTER(WHERE ip_hash=$2 AND created_at >= date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC') AS ip_used,
        count(*) FILTER(WHERE status='reserved') AS active,
        count(*) FILTER(WHERE status='reserved' AND ip_hash=$2) AS ip_active,
        count(*) FILTER(WHERE status='reserved' AND session_id=$1) AS session_active FROM chat_reservations`,[sessionId,ipHash])).rows[0];
      if (Number(usage.session_used)>=config.chatDailySession || Number(usage.ip_used)>=config.chatDailyIp) throw new HttpError(429,'Limite diário de mensagens atingido. Tente novamente amanhã.');
      if (Number(usage.active)>=config.chatGlobalConcurrency || Number(usage.ip_active)>=config.chatIpConcurrency || Number(usage.session_active)>0) throw new HttpError(429,'Uma conversa está em andamento. Tente novamente em instantes.');
      return (await client.query(`INSERT INTO chat_reservations(session_id,ip_hash,expires_at) VALUES($1,$2,now()+$3*interval '1 millisecond') RETURNING id`,[sessionId,ipHash,config.chatTimeoutMs+15000])).rows[0].id;
    }),
    history: async sessionId => {
      const rows = (await pool.query('SELECT user_message,ai_response FROM interaction_logs WHERE session_id=$1 ORDER BY timestamp DESC NULLS LAST,id DESC LIMIT 6',[sessionId])).rows;
      return rows.reverse().flatMap(row => [{role:'user',content:row.user_message},{role:'assistant',content:row.ai_response}]).filter(item => typeof item.content==='string' && item.content.trim());
    },
    knowledge: async () => (await pool.query('SELECT * FROM agent_knowledge ORDER BY created_at,id')).rows,
    completeChat: async (reservationId,{sessionId,message,answer}) => transaction(pool, async client => {
      const reservation = (await client.query("SELECT id FROM chat_reservations WHERE id=$1 AND status='reserved' AND expires_at>now() FOR UPDATE",[reservationId])).rows[0];
      if (!reservation) throw new Error('Chat reservation expired.');
      const interaction = (await client.query('INSERT INTO interaction_logs(session_id,user_message,ai_response,is_read) VALUES($1,$2,$3,false) RETURNING id',[sessionId,message,answer])).rows[0];
      await client.query("UPDATE chat_reservations SET status='completed',interaction_id=$2 WHERE id=$1",[reservationId,interaction.id]);
    }),
    failChat: async id => pool.query("UPDATE chat_reservations SET status='failed' WHERE id=$1 AND status='reserved'",[id]),
    cleanup: async () => transaction(pool, async client => {
      await client.query("UPDATE chat_reservations SET status='expired' WHERE status='reserved' AND expires_at<=now()");
      await client.query('DELETE FROM app_sessions WHERE expires_at<now()');
      await client.query("DELETE FROM app_rate_limits WHERE window_start<now()-interval '2 days'");
      await client.query("DELETE FROM chat_reservations WHERE created_at<now()-interval '7 days' AND status!='reserved'");
    }),
  };
}
