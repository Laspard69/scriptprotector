import crypto from 'crypto'
import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { script } = req.body || {}
  if (!script || typeof script !== 'string') return res.status(400).json({ error: 'No script provided' })

  const id = crypto.randomBytes(16).toString('hex')

  try {
    const client = await clientPromise
    const db = client.db('robloxkeys') // your DB name
    const collection = db.collection('scripts')

    await collection.insertOne({
      _id: id,
      script,
      createdAt: new Date() // only store creation timestamp
    })

    return res.status(200).json({ id })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Database error' })
  }
}
