import { Handler } from '@netlify/functions'
import { MongoClient } from 'mongodb'
import { apiPost, apiPut } from './api'

const uri = process.env.MONGODB_URI as string
const dbName = process.env.DB_NAME || 'einkaufsapp'
const collName = process.env.COLL_EXPENSES || 'expenses'
const householdId = process.env.HOUSEHOLD_ID || 'birgit-stefan'

let client: MongoClient | null = null
async function getColl() {
  if (!client) {
    client = new MongoClient(uri)
    await client.connect()
  }
  return client.db(dbName).collection(collName)
}

const handler: Handler = async (event) => {
  try {
    const coll = await getColl()

    if (event.httpMethod === 'GET') {
      // Alle Einträge laden
      const docs = await coll.find({ householdId }).sort({ date: -1 }).toArray()
      return { statusCode: 200, body: JSON.stringify(docs) }
    }

    if (event.httpMethod === 'POST') {
      // Neuen Eintrag speichern
      const body = JSON.parse(event.body || '{}')
      body.householdId = householdId
      body.createdAt = new Date().toISOString()
      body.updatedAt = new Date().toISOString()
      await coll.insertOne(body)
      return { statusCode: 200, body: JSON.stringify({ ok: true }) }
    }

    if (event.httpMethod === 'PUT') {
      // Eintrag updaten
      const body = JSON.parse(event.body || '{}')
      if (!body.id) return { statusCode: 400, body: 'id required' }
      body.updatedAt = new Date().toISOString()
      await coll.updateOne(
        { id: body.id, householdId },
        { $set: body }
      )
      return { statusCode: 200, body: JSON.stringify({ ok: true }) }
    }

    return { statusCode: 405, body: 'Method not allowed' }
  } catch (err: any) {
    console.error(err)
    return { statusCode: 500, body: err.message }
  }
}

export { handler }

export async function addExpense(input: Omit<Expense, 'id'|'createdAt'|'updatedAt'>) {
  const db = await getDB()
  const now = new Date().toISOString()
  const id = makeId(input.date)
  const e: Expense = { id, createdAt: now, updatedAt: now, ...input }
  await db.add('expenses', e)
  emit('db-changed')
  // Cloud (best effort)
  apiPost(e).catch(err => console.warn('Cloud POST failed:', err))
  return e
}

export async function updateExpense(id: string, patch: Partial<Omit<Expense,'id'|'createdAt'>>) {
  const db = await getDB()
  const current = await db.get('expenses', id)
  if (!current) throw new Error('Expense not found: ' + id)
  const updated: Expense = { ...current, ...patch, updatedAt: new Date().toISOString() }
  await db.put('expenses', updated)
  emit('db-changed')
  // Cloud (best effort)
  apiPut(updated).catch(err => console.warn('Cloud PUT failed:', err))
  return updated
}
