const http = require('http')
const fs = require('fs')
const path = require('path')

const root = path.resolve(process.argv[2])
const port = Number(process.argv[3] || 3333)

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  let filePath = path.join(root, urlPath === '/' ? 'index.html' : urlPath.replace(/^\//, ''))

  if (!filePath.startsWith(root)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  const sendFile = (target) => {
    const ext = path.extname(target).toLowerCase()
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' })
    fs.createReadStream(target).pipe(res)
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
    }

    fs.stat(filePath, (fileErr, fileStats) => {
      if (!fileErr && fileStats.isFile()) {
        sendFile(filePath)
        return
      }

      const fallback = path.join(root, 'index.html')
      fs.stat(fallback, (fallbackErr, fallbackStats) => {
        if (!fallbackErr && fallbackStats.isFile()) {
          sendFile(fallback)
          return
        }

        res.writeHead(404)
        res.end('Not found')
      })
    })
  })
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Studio static server running at http://127.0.0.1:${port}`)
})
