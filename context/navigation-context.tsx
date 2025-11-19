'use client'

import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react'

interface NavigationContextType {
  isAuthenticated: boolean
  setIsAuthenticated: (authenticated: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedSession = localStorage.getItem('admin_session')
    setIsAuthenticated(!!savedSession)
    setMounted(true)
  }, [])

  const handleSetIsAuthenticated = (authenticated: boolean) => {
    setIsAuthenticated(authenticated)
    if (!authenticated) localStorage.removeItem('admin_session')
  }

  const value = useMemo(
    () => ({ isAuthenticated, setIsAuthenticated: handleSetIsAuthenticated }),
    [isAuthenticated]
  )

  if (!mounted) return <>{children}</>

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) throw new Error('useNavigation must be used within NavigationProvider')
  return context
}
