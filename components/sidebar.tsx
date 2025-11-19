'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useDataStore } from '@/hooks/use-data-store'
import { useNavigation } from '@/context/navigation-context'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, Users, ShoppingCart, Receipt, Bell, DollarSign, BarChart3, LogOut } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentAdmin, logout } = useDataStore()
  const { setIsAuthenticated } = useNavigation()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/employees', label: 'Employees', icon: Users },
    { href: '/customers', label: 'Customers', icon: ShoppingCart },
    { href: '/transactions', label: 'Transactions', icon: Receipt },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/salary', label: 'Salary Payment', icon: DollarSign },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
  ]

  const handleLogout = () => {
    logout()
    setIsAuthenticated(false)
    router.push('/')
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 border-r border-slate-700 flex flex-col h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-cyan-400">LaundryPro</h1>
        <p className="text-sm text-slate-400 mt-1">Management System</p>
      </div>

      {currentAdmin && (
        <div className="mb-6 p-3 bg-slate-700 rounded-lg border border-slate-600">
          <p className="text-xs text-slate-400">Logged in as</p>
          <p className="text-sm font-semibold text-white truncate">{currentAdmin.name}</p>
        </div>
      )}

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start gap-3 ${
                  isActive ? 'bg-cyan-600 hover:bg-cyan-700' : 'hover:bg-slate-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <Button
        onClick={handleLogout}
        variant="ghost"
        className="w-full justify-start gap-3 hover:bg-red-900/20 text-red-400 hover:text-red-300"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </Button>
    </aside>
  )
}
