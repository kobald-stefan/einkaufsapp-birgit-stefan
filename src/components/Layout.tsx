import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <header className="mx-auto max-w-[var(--app-max)] px-4 py-4">
        <h1 className="text-xl font-semibold">Einkaufsapp Birgit & Stefan 🛒</h1>
      </header>

      <main className="mx-auto max-w-[var(--app-max)] px-4 pb-24">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
