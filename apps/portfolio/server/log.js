// One JSON object per line on stdout/stderr, so `docker logs` stays greppable.
// Never pass request bodies, emails, tokens, cookies or query strings here.
const write = (stream, level, event, fields) => {
  stream.write(`${JSON.stringify({time: new Date().toISOString(), level, event, ...fields})}\n`);
};

// Error message, PostgreSQL SQLSTATE and a short stack. pg puts row values in
// `detail`, which is deliberately left out.
export const errorFields = error => {
  if (!(error instanceof Error)) return {error: String(error)};
  return {
    error: error.message,
    ...(error.code ? {code: String(error.code)} : {}),
    ...(error.stack ? {stack: error.stack.split('\n').slice(1, 4).map(line => line.trim()).join(' | ')} : {}),
  };
};

export const logger = {
  info: (event, fields = {}) => write(process.stdout, 'info', event, fields),
  warn: (event, fields = {}) => write(process.stderr, 'warn', event, fields),
  error: (event, error, fields = {}) => write(process.stderr, 'error', event, {...fields, ...(error === undefined ? {} : errorFields(error))}),
};
