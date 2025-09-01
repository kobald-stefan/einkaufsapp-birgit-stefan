import { useEffect, useState } from 'react'
import { addShopping, deleteShopping, getAllShopping, pullShopping } from '../lib/shopping'
import type { ShoppingItem } from '../types'

export default function Shopping() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [text, setText] = useState('')

  async function refresh() {
    const all = await getAllShopping()
    setItems(all)
  }

  useEffect(() => {
    (async () => {
      await pullShopping()
      await refresh()
    })()
  }, [])

  async function onAdd() {
    const t = text.trim()
    if (!t) return
    await addShopping(t)
    setText('')
    await refresh()
  }

  async function onCheck(id: string) {
    // sofort löschen (unwiderruflich)
    await deleteShopping(id)
    await refresh()
  }

  return (
    <section className="py-2">
      <h2 className="mb-3 text-base font-medium">Einkaufsliste</h2>

      <div className="mb-3 flex gap-2">
        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="Artikel hinzufügen (z. B. Brot)"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
          onKeyDown={e=>{ if (e.key==='Enter') onAdd() }}
        />
        <button onClick={onAdd} className="rounded-lg bg-red-800 hover:bg-red-600 px-3 py-2 text-white">+ Hinzufügen</button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 p-4 text-slate-500">
          Noch leer. Füge oben Artikel hinzu.
        </div>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
          {items.map(it => (
            <li key={it.id} className="flex items-center gap-3 px-4 py-3">
              <input
                type="checkbox"
                onChange={()=>onCheck(it.id)}
                className="h-5 w-5 accent-slate-900"
              />
              <span className="text-base">{it.text}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
