'use client'

import { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react'

interface NavigationContextType {
  isAuthenticated: boolean
  setIsAuthenticated: (authenticated: boolean) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Sync localStorage -> state ONCE after client hydration
  useEffect(() => {
    const saved = localStorage.getItem('admin_session') === '1'
    setIsAuthenticated(saved)
  }, [])

  const handleSetIsAuthenticated = (authenticated: boolean) => {
    setIsAuthenticated(authenticated)
    if (authenticated) {
      localStorage.setItem('admin_session', '1')
    } else {
      localStorage.removeItem('admin_session')
    }
  }

  const value = useMemo(
    () => ({ isAuthenticated, setIsAuthenticated: handleSetIsAuthenticated }),
    [isAuthenticated]
  )

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

export function AuthRedirect() {
  return null // no redirects here
}
