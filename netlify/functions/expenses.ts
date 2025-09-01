import type { Handler } from '@netlify/functions'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI as string
const dbName = process.env.DB_NAME || 'einkaufsapp'
const collName = process.env.COLL_EXPENSES || 'expenses'
const householdId = process.env.HOUSEHOLD_ID || 'birgit-stefan'

// Ein globaler, wiederverwendbarer Client (pro Lambda-Container)
let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

function getClient(): Promise<MongoClient> {
  if (client) return Promise.resolve(client)
  if (!clientPromise) {
    const c = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000, // schnell scheitern statt hängen
    })
    clientPromise = c.connect().then((connected) => {
      client = connected
      return connected
    })
  }
  return clientPromise
}

async function getColl() {
  const c = await getClient()
  return c.db(dbName).collection(collName)
}

export const handler: Handler = async (event) => {
  try {
    const coll = await getColl()

    if (event.httpMethod === 'GET') {
      const docs = await coll.find({ householdId }).sort({ date: -1 }).toArray()
      return { statusCode: 200, body: JSON.stringify(docs) }
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}')
      body.householdId = householdId
      body.createdAt = new Date().toISOString()
      body.updatedAt = new Date().toISOString()
      await coll.insertOne(body)
      return { statusCode: 200, body: JSON.stringify({ ok: true }) }
    }

    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}')
      if (!body.id) return { statusCode: 400, body: 'id required' }
      body.updatedAt = new Date().toISOString()
      await coll.updateOne({ id: body.id, householdId }, { $set: body })
      return { statusCode: 200, body: JSON.stringify({ ok: true }) }
    }

    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, body: '' }
    }

    return { statusCode: 405, body: 'Method not allowed' }
  } catch (err: any) {
    return { statusCode: 500, body: `DB error: ${err?.message || 'unknown'}` }
  }
}
