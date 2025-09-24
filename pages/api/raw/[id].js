import clientPromise from '../../../lib/mongodb'

export default async function handler(req, res) {
  const { id } = req.query || {}

  const allow = req.headers['x-allow-fetch']
  if (!allow || String(allow).toLowerCase() !== 'true') {
    res.status(403).setHeader('content-type', 'text/plain').send('ACCESS DENIED')
    return
  }

  try {
    const client = await clientPromise
    const db = client.db('robloxkeys')
    const collection = db.collection('scripts')

    const doc = await collection.findOne({ _id: id })
    if (!doc) {
      res.status(404).setHeader('content-type', 'text/plain').send('NOT FOUND')
      return
    }

    res.status(200).setHeader('content-type', 'text/plain; charset=utf-8').send(doc.script)
  } catch (e) {
    console.error(e)
    res.status(500).setHeader('content-type', 'text/plain').send('DB ERROR')
  }
}
