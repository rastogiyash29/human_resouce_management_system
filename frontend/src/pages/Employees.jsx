import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useEmployees } from '../hooks/useEmployees'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Toast from '../components/common/Toast'
import EmployeeTable from '../components/employees/EmployeeTable'
import AddEmployeeForm from '../components/employees/AddEmployeeForm'

export default function Employees() {
  const { employees, loading, error, refetch, addEmployee, removeEmployee } = useEmployees()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const handleAddEmployee = async (data) => {
    try {
      setIsSubmitting(true)
      await addEmployee(data)
      setIsAddModalOpen(false)
      setToast({ message: 'Employee added successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true)
      await removeEmployee(selectedEmployee.employee_id)
      setIsDeleteDialogOpen(false)
      setSelectedEmployee(null)
      setToast({ message: 'Employee deleted successfully', type: 'success' })
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {employees.length === 0 ? (
        <EmptyState
          title="No employees yet"
          description="Get started by adding your first employee."
          action={
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          }
        />
      ) : (
        <EmployeeTable employees={employees} onDelete={handleDeleteClick} />
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
      >
        <AddEmployeeForm
          onSubmit={handleAddEmployee}
          onCancel={() => setIsAddModalOpen(false)}
          loading={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee?.full_name}? This action cannot be undone and will also delete all attendance records.`}
        confirmText="Delete"
        loading={isSubmitting}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
