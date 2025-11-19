'use client'

import { create } from 'zustand'
import { useEffect, useState } from 'react'

export interface Admin {
  id: string
  username: string
  password: string
  name: string
}

export interface Employee {
  id: string
  name: string
  phone: string
  role: string
  salary: number
  address: string
  status: 'active' | 'inactive'
}

export interface Customer {
  id: string
  name: string
  phone: string
  address: string
  totalTransactions: number
}

export interface Transaction {
  id: string
  customerId: string
  employeeId: string
  weight: number
  orderDate: string
  collectionDate: string
  amountToPay: number
  amountPaid: number
  balance: number
  status: 'pending' | 'completed'
}

export interface SalaryPayment {
  id: string
  employeeId: string
  amount: number
  paymentDate: string
}

interface DataStore {
  currentAdmin: Admin | null
  login: (username: string, password: string) => boolean
  logout: () => void
  
  employees: Employee[]
  customers: Customer[]
  transactions: Transaction[]
  salaryPayments: SalaryPayment[]
  
  addEmployee: (employee: Omit<Employee, 'id'>) => void
  updateEmployee: (id: string, employee: Omit<Employee, 'id'>) => void
  deleteEmployee: (id: string) => void
  
  addCustomer: (customer: Omit<Customer, 'id'>) => void
  updateCustomer: (id: string, customer: Omit<Customer, 'id'>) => void
  deleteCustomer: (id: string) => void
  
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  
  addSalaryPayment: (payment: Omit<SalaryPayment, 'id'>) => void
  
  getMetrics: () => {
    totalEmployees: number
    totalCustomers: number
    totalTransactions: number
    pendingTransactions: number
    totalIncome: number
  }
  
  setBatchData: (data: { employees: Employee[], customers: Customer[], transactions: Transaction[], salaryPayments: SalaryPayment[] }) => void
}

let metricsCache: ReturnType<DataStore['getMetrics']> | null = null
let lastState: { employees: Employee[], customers: Customer[], transactions: Transaction[], salaryPayments: SalaryPayment[] } | null = null

const SEEDED_ADMINS: Admin[] = [
  { id: '1', username: 'admin', password: 'admin123', name: 'Admin User' },
  { id: '2', username: 'manager', password: 'manager123', name: 'Manager' },
]

// Fetch functions to load data from database
async function fetchEmployees() {
  const response = await fetch('/api/employees')
  if (!response.ok) throw new Error('Failed to fetch employees')
  return response.json()
}

async function fetchCustomers() {
  const response = await fetch('/api/customers')
  if (!response.ok) throw new Error('Failed to fetch customers')
  return response.json()
}

async function fetchTransactions() {
  const response = await fetch('/api/transactions')
  if (!response.ok) throw new Error('Failed to fetch transactions')
  return response.json()
}

async function fetchSalaryPayments() {
  const response = await fetch('/api/salary-payments')
  if (!response.ok) throw new Error('Failed to fetch salary payments')
  return response.json()
}

export const useDataStore = create<DataStore>((set, get) => ({
  currentAdmin: null,
  
  login: (username, password) => {
    const admin = SEEDED_ADMINS.find(a => a.username === username && a.password === password)
    if (admin) {
      set({ currentAdmin: admin })
      if (typeof window !== 'undefined') {
       localStorage.setItem('admin_session', '1')

      }
      return true
    }
    return false
  },
  
  logout: () => {
    set({ currentAdmin: null })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_session')
    }
  },

  employees: [],
  customers: [],
  transactions: [],
  salaryPayments: [],

  addEmployee: (employee) => {
    const id = Date.now().toString()
    const newEmployee = { ...employee, id }
    
    set((state) => ({
      employees: [...state.employees, newEmployee],
    }))
    
    fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    }).catch(console.error)
  },

  updateEmployee: (id, employee) => {
    set((state) => ({
      employees: state.employees.map((e) => (e.id === id ? { ...employee, id } : e)),
    }))
    
    fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    }).catch(console.error)
  },

  deleteEmployee: (id) => {
    set((state) => ({
      employees: state.employees.filter((e) => e.id !== id),
    }))
    
    fetch(`/api/employees/${id}`, {
      method: 'DELETE',
    }).catch(console.error)
  },

  addCustomer: (customer) => {
    const id = Date.now().toString()
    const newCustomer = { ...customer, id }
    
    set((state) => ({
      customers: [...state.customers, newCustomer],
    }))
    
    fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    }).catch(console.error)
  },

  updateCustomer: (id, customer) => {
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? { ...customer, id } : c)),
    }))
    
    fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    }).catch(console.error)
  },

  deleteCustomer: (id) => {
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    }))
    
    fetch(`/api/customers/${id}`, {
      method: 'DELETE',
    }).catch(console.error)
  },

  addTransaction: (transaction) => {
    const id = Date.now().toString()
    const newTransaction = { ...transaction, id }
    
    set((state) => ({
      transactions: [...state.transactions, newTransaction],
    }))
    
    fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    }).catch(console.error)
  },

  updateTransaction: (id, transaction) => {
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...transaction, id } : t)),
    }))
    
    fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    }).catch(console.error)
  },

  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }))
    
    fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
    }).catch(console.error)
  },

  addSalaryPayment: (payment) => {
    const id = Date.now().toString()
    const newPayment = { ...payment, id }
    
    set((state) => ({
      salaryPayments: [...state.salaryPayments, newPayment],
    }))
    
    fetch('/api/salary-payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment),
    }).catch(console.error)
  },

  getMetrics: () => {
    const state = get()
    const stateChanged = lastState === null || 
      lastState.employees !== state.employees ||
      lastState.customers !== state.customers ||
      lastState.transactions !== state.transactions ||
      lastState.salaryPayments !== state.salaryPayments

    if (stateChanged) {
      const totalIncome = state.transactions
        .filter((t) => t.status === 'completed')
        .reduce((sum, t) => sum + t.amountPaid, 0)
      const pendingTransactions = state.transactions.filter((t) => t.status === 'pending').length

      metricsCache = {
        totalEmployees: state.employees.length,
        totalCustomers: state.customers.length,
        totalTransactions: state.transactions.length,
        pendingTransactions,
        totalIncome,
      }
      lastState = {
        employees: state.employees,
        customers: state.customers,
        transactions: state.transactions,
        salaryPayments: state.salaryPayments,
      }
    }

    return metricsCache!
  },
  
  setBatchData: (data) => {
    set({
      employees: data.employees,
      customers: data.customers,
      transactions: data.transactions,
      salaryPayments: data.salaryPayments,
    })
  },
}))

// Custom hook to load initial data from database
export function useInitializeStore() {
  const [isLoading, setIsLoading] = useState(true)

  const setEmployees = (employees: any) => {
    useDataStore.setState({ employees })
  }

  const setCustomers = (customers: any) => {
    useDataStore.setState({ customers })
  }

  const setTransactions = (transactions: any) => {
    useDataStore.setState({ transactions })
  }

  const setSalaryPayments = (salaryPayments: any) => {
    useDataStore.setState({ salaryPayments })
  }

  useEffect(() => {
    async function initializeData() {
      try {
        const [employees, customers, transactions, salaryPayments] = await Promise.all([
          fetchEmployees(),
          fetchCustomers(),
          fetchTransactions(),
          fetchSalaryPayments(),
        ])

        setEmployees(employees)
        setCustomers(customers)
        setTransactions(transactions)
        setSalaryPayments(salaryPayments)
      } catch (error) {
        console.error('Error initializing data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  return isLoading
}

