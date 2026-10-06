const http = require('http')
const fs = require('fs')
const path = require('path')

const root = path.resolve(process.argv[2] || 'dist')
const port = Number(process.argv[3] || 3333)

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function sendError(res, status, message) {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
  })
  res.end(message)
}

const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) return sendError(res, 405, 'Method not allowed')

  let pathname
  try {
    pathname = decodeURIComponent(new URL(req.url || '/', 'http://localhost').pathname)
  } catch {
    return sendError(res, 400, 'Invalid path')
  }
  if (pathname.includes('\0') || pathname.includes('\\')) return sendError(res, 400, 'Invalid path')

  const requestedPath = pathname.replace(/^\/+/, '') || 'index.html'
  const filename = path.resolve(root, requestedPath)
  const relativePath = path.relative(root, filename)
  if (relativePath === '..' || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
    return sendError(res, 403, 'Forbidden')
  }

  let target = filename
  let stats
  try {
    stats = await fs.promises.stat(target)
    if (stats.isDirectory()) {
      target = path.join(target, 'index.html')
      stats = await fs.promises.stat(target)
    }
  } catch {
    if (path.extname(pathname)) return sendError(res, 404, 'Not found')
    target = path.join(root, 'index.html')
    try {
      stats = await fs.promises.stat(target)
    } catch {
      return sendError(res, 503, 'Studio build is unavailable')
    }
  }

  const ext = path.extname(target).toLowerCase()
  const headers = {
    'Content-Type': mime[ext] || 'application/octet-stream',
    'Content-Length': stats.size,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600',
  }
  res.writeHead(200, headers)
  if (req.method === 'HEAD') return res.end()

  const stream = fs.createReadStream(target)
  stream.on('error', () => {
    if (!res.headersSent) sendError(res, 500, 'Unable to read Studio asset')
    else res.destroy()
  })
  stream.pipe(res)
})

server.listen(port, process.env.STUDIO_HOST || '0.0.0.0', () => {
  console.log(`Studio static server listening on port ${port}`)
})
