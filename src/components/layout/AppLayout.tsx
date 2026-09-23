import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, ListTree, Receipt, Tags, LogOut } from 'lucide-react'
import logo from '../../assets/brand/logo.png'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/transactions', label: 'Transactions', icon: Receipt, end: false },
  { to: '/summary', label: 'Monthly Summary', icon: ListTree, end: false },
  { to: '/categories', label: 'Categories', icon: Tags, end: false },
]

export function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-brand-gray">
      <header className="border-b border-brand-border bg-brand-black">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Construction Hub PH" className="h-10 w-10 object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-wide text-white sm:text-base">
                Construction Hub Payment System
              </span>
              <span className="text-xs text-brand-green">CONSTRUCTION HUB PH</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-neutral-300 sm:inline">{user?.email}</span>
            <Button variant="secondary" onClick={() => logout()} className="!py-2">
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 whitespace-nowrap rounded-t-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-gray text-brand-black'
                    : 'text-neutral-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
