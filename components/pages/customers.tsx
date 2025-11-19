'use client'

import { useState } from 'react'
import { useDataStore, Customer } from '@/hooks/use-data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, Plus } from 'lucide-react'
import { CustomerForm } from '@/components/forms/customer-form'
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog'
import { ToastContainer, ToastType } from '@/components/toast-notification'

export function CustomersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: '', name: '' })
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([])
  
  const customers = useDataStore((state) => state.customers)
  const addCustomer = useDataStore((state) => state.addCustomer)
  const updateCustomer = useDataStore((state) => state.updateCustomer)
  const deleteCustomer = useDataStore((state) => state.deleteCustomer)

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const handleSave = (data: Omit<Customer, 'id'>) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data)
      addToast('Customer updated successfully', 'success')
    } else {
      addCustomer(data)
      addToast('Customer added successfully', 'success')
    }
    setIsFormOpen(false)
    setEditingCustomer(null)
  }

  const handleDeleteClick = (cust: Customer) => {
    setDeleteConfirm({ open: true, id: cust.id, name: cust.name })
  }

  const handleConfirmDelete = () => {
    deleteCustomer(deleteConfirm.id)
    addToast(`Customer "${deleteConfirm.name}" deleted successfully`, 'success')
    setDeleteConfirm({ open: false, id: '', name: '' })
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
        <Button
          onClick={() => {
            setEditingCustomer(null)
            setIsFormOpen(true)
          }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      {isFormOpen && (
        <CustomerForm
          customer={editingCustomer}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingCustomer(null)
          }}
        />
      )}

      <Card className="bg-white border-0 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Address</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Transactions</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{cust.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cust.phone}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cust.address}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cust.totalTransactions}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setEditingCustomer(cust)
                          setIsFormOpen(true)
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(cust)}
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <DeleteConfirmationDialog
        open={deleteConfirm.open}
        title="Delete Customer"
        description={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: '', name: '' })}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
