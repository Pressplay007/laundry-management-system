'use client'

import { useEffect, useState } from 'react'
import { useDataStore } from '@/hooks/use-data-store'

export function DataLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  
  const setEmployees = useDataStore((state) => {
    return (employees: any[]) => {
      // Directly update the store by calling addEmployee or through a batch method
      state.employees = employees
    }
  })

  useEffect(() => {
    async function loadData() {
      try {
        console.log('[v0] Starting data load from database...')
        
        const [employees, customers, transactions, salaryPayments] = await Promise.all([
          fetch('/api/employees').then(r => r.json()).catch(() => []),
          fetch('/api/customers').then(r => r.json()).catch(() => []),
          fetch('/api/transactions').then(r => r.json()).catch(() => []),
          fetch('/api/salary-payments').then(r => r.json()).catch(() => []),
        ])

        console.log('[v0] Data loaded:', { employees, customers, transactions, salaryPayments })

        // Update store with loaded data
        const store = useDataStore.getState()
        
        // Clear existing data and load from database
        store.employees = employees.map((e: any) => ({
          id: e.id,
          name: e.name,
          phone: e.phone,
          role: e.role,
          salary: Number(e.salary),
          address: e.address,
          status: e.status,
        }))

        store.customers = customers.map((c: any) => ({
          id: c.id,
          name: c.name,
          phone: c.phone,
          address: c.address,
          totalTransactions: c.total_transactions || 0,
        }))

        store.transactions = transactions.map((t: any) => ({
          id: t.id,
          customerId: t.customer_id,
          employeeId: t.employee_id,
          weight: Number(t.weight),
          orderDate: t.order_date,
          collectionDate: t.collection_date,
          amountToPay: Number(t.amount_to_pay),
          amountPaid: Number(t.amount_paid),
          balance: Number(t.balance),
          status: t.status,
        }))

        store.salaryPayments = salaryPayments.map((p: any) => ({
          id: p.id,
          employeeId: p.employee_id,
          amount: Number(p.amount),
          paymentDate: p.payment_date,
        }))

        console.log('[v0] Store updated successfully')
      } catch (error) {
        console.error('[v0] Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading data...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
