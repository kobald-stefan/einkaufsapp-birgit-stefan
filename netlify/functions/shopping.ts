import type { Handler } from '@netlify/functions'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI as string
const dbName = process.env.DB_NAME || 'einkaufsapp'
const collName = process.env.COLL_SHOPPING || 'shopping'
const householdId = process.env.HOUSEHOLD_ID || 'birgit-stefan'

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null
function getClient(): Promise<MongoClient> {
  if (client) return Promise.resolve(client)
  if (!clientPromise) {
    const c = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
    clientPromise = c.connect().then(x => (client = x))
  }
  return clientPromise!
}
async function getColl() {
  const c = await getClient()
  return c.db(dbName).collection(collName)
}

export const handler: Handler = async (event) => {
  try {
    const coll = await getColl()

    if (event.httpMethod === 'GET') {
      const docs = await coll.find({ householdId }).sort({ createdAt: 1 }).toArray()
      return { statusCode: 200, body: JSON.stringify(docs) }
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}')
      if (!body?.id || !body?.text) return { statusCode: 400, body: 'id & text required' }
      body.householdId = householdId
      body.createdAt = body.createdAt || new Date().toISOString()
      await coll.insertOne(body)
      return { statusCode: 200, body: JSON.stringify({ ok: true }) }
    }

    if (event.httpMethod === 'DELETE') {
      const id = (event.queryStringParameters?.id || '').trim()
      if (!id) return { statusCode: 400, body: 'id required' }
      await coll.deleteOne({ id, householdId })
      return { statusCode: 200, body: JSON.stringify({ ok: true }) }
    }

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, body: '' }
    return { statusCode: 405, body: 'Method not allowed' }
  } catch (err: any) {
    return { statusCode: 500, body: `DB error: ${err?.message || 'unknown'}` }
  }
}
