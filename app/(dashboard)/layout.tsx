'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { DataLoader } from '@/components/data-loader'
import { useNavigation } from '@/context/navigation-context'
import { useDataStore } from '@/hooks/use-data-store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, setIsAuthenticated } = useNavigation()
  const [isChecking, setIsChecking] = useState(true)
  const { login } = useDataStore()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSession = localStorage.getItem('admin_session')
      if (savedSession) {
        try {
          const admin = JSON.parse(savedSession)
          const success = login(admin.username, admin.password)
          if (success) {
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem('admin_session')
            router.push('/')
          }
        } catch (error) {
          console.error('Failed to restore session:', error)
          localStorage.removeItem('admin_session')
          router.push('/')
        }
      } else if (!isAuthenticated) {
        router.push('/')
      }
      setIsChecking(false)
    }
  }, [])

  if (isChecking || !isAuthenticated) {
    return null
  }

  return (
    <DataLoader>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </DataLoader>
  )
}
