'use client'

import { useState } from 'react'
import { useDataStore, Employee } from '@/hooks/use-data-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Edit2, Plus } from 'lucide-react'
import { EmployeeForm } from '@/components/forms/employee-form'
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog'
import { ToastContainer, ToastType } from '@/components/toast-notification'

export function EmployeesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: '', name: '' })
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([])
  
  const employees = useDataStore((state) => state.employees)
  const addEmployee = useDataStore((state) => state.addEmployee)
  const updateEmployee = useDataStore((state) => state.updateEmployee)
  const deleteEmployee = useDataStore((state) => state.deleteEmployee)

  const addToast = (message: string, type: ToastType) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const handleSave = (data: Omit<Employee, 'id'>) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, data)
      addToast('Employee updated successfully', 'success')
    } else {
      addEmployee(data)
      addToast('Employee added successfully', 'success')
    }
    setIsFormOpen(false)
    setEditingEmployee(null)
  }

  const handleDeleteClick = (emp: Employee) => {
    setDeleteConfirm({ open: true, id: emp.id, name: emp.name })
  }

  const handleConfirmDelete = () => {
    deleteEmployee(deleteConfirm.id)
    addToast(`Employee "${deleteConfirm.name}" deleted successfully`, 'success')
    setDeleteConfirm({ open: false, id: '', name: '' })
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
        <Button
          onClick={() => {
            setEditingEmployee(null)
            setIsFormOpen(true)
          }}
          className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </Button>
      </div>

      {isFormOpen && (
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingEmployee(null)
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Salary</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{emp.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{emp.phone}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{emp.role}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">GHS {emp.salary}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        emp.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setEditingEmployee(emp)
                          setIsFormOpen(true)
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(emp)}
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
        title="Delete Employee"
        description={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: '', name: '' })}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
