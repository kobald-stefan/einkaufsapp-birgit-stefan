import { NavLink } from 'react-router-dom'

const itemCls =
  "flex-1 flex items-center justify-center text-sm font-medium py-5 tracking-wide"

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 h-18">
      <div className="mx-auto flex max-w-[var(--app-max)]">
        <NavLink to="/" end
          className={({isActive}) => `${itemCls} ${isActive ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
          Dashboard
        </NavLink>
        <NavLink to="/expenses"
          className={({isActive}) => `${itemCls} ${isActive ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
          Einkäufe
        </NavLink>
        <NavLink to="/month"
          className={({isActive}) => `${itemCls} ${isActive ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
          Monat
        </NavLink>
        <NavLink to="/settings"
          className={({isActive}) => `${itemCls} ${isActive ? 'text-slate-900 font-medium' : 'text-slate-500'}`}>
          Einstellungen
        </NavLink>
      </div>
    </nav>
  )
}
