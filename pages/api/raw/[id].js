// pages/api/raw/[id].js
import clientPromise from '../../../lib/mongodb'

/**
 * Behavior:
 * - If request has header x-allow-fetch: true -> return script (keeps compatibility with earlier approach).
 * - Else if query param ?key=<ACCESS_KEY> matches env ACCESS_KEY -> return script.
 * - Else if User-Agent contains 'roblox' -> return script (works for loadstring(game:HttpGet(...))).
 * - Otherwise return 403 ACCESS DENIED.
 *
 * Note: UA check is convenient but not foolproof. For stronger security use signed URLs or a secret key.
 */

export default async function handler(req, res) {
  const { id } = req.query || {}

  // 1) Quick allow by header (backwards compat)
  const headerAllow = req.headers['x-allow-fetch']
  if (headerAllow && String(headerAllow).toLowerCase() === 'true') {
    return serveScript(id, res)
  }

  // 2) Allow by query key if provided (set ACCESS_KEY in Vercel env to use)
  const key = req.query && req.query.key
  if (key && process.env.ACCESS_KEY && key === process.env.ACCESS_KEY) {
    return serveScript(id, res)
  }

  // 3) Allow Roblox clients by User-Agent string (Roblox HttpGet sends UA that includes 'Roblox')
  const ua = (req.headers['user-agent'] || '').toString().toLowerCase()
  if (ua.includes('roblox')) {
    return serveScript(id, res)
  }

  // 4) Deny all other requests
  res.status(403).setHeader('content-type', 'text/plain').send('ACCESS DENIED')
}

// helper: fetch from Mongo and return raw text (or appropriate error)
async function serveScript(id, res) {
  if (!id) {
    res.status(400).setHeader('content-type', 'text/plain').send('BAD REQUEST')
    return
  }

  try {
    const client = await clientPromise
    const db = client.db('robloxkeys') // match your DB name
    const collection = db.collection('scripts')

    const doc = await collection.findOne({ _id: id })
    if (!doc) {
      res.status(404).setHeader('content-type', 'text/plain').send('NOT FOUND')
      return
    }

    // Return raw script as plain text (suitable for loadstring(HttpGet(...)))
    res.status(200).setHeader('content-type', 'text/plain; charset=utf-8').send(doc.script)
  } catch (err) {
    console.error('/api/raw error:', err)
    res.status(500).setHeader('content-type', 'text/plain').send('DB ERROR')
  }
}
