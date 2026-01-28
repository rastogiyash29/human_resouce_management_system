import { useState } from 'react'
import { Plus, RotateCcw, UserCheck, UserX } from 'lucide-react'
import { useAttendance } from '../hooks/useAttendance'
import { useEmployees } from '../hooks/useEmployees'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import MultiSelect from '../components/common/MultiSelect'
import DateRangeFilter from '../components/common/DateRangeFilter'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import Toast from '../components/common/Toast'
import AttendanceTable from '../components/attendance/AttendanceTable'
import MarkAttendanceForm from '../components/attendance/MarkAttendanceForm'

const initialFilters = {
  employeeIds: [],
  dateFrom: null,
  dateTo: null,
  status: null,
}

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'Present', label: 'Present Only' },
  { value: 'Absent', label: 'Absent Only' },
]

export default function Attendance() {
  const [filters, setFilters] = useState(initialFilters)
  const { attendance, summary, loading, error, refetch, addAttendance, editAttendance } = useAttendance(filters)
  const { employees, loading: employeesLoading } = useEmployees()
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const handleMarkAttendance = async (data) => {
    try {
      setIsSubmitting(true)
      const result = await addAttendance(data)
      setIsMarkModalOpen(false)

      if (result.created !== undefined) {
        const createdCount = result.created.length
        const skippedCount = result.skipped.length

        if (createdCount > 0 && skippedCount === 0) {
          setToast({ message: `Attendance marked for ${createdCount} employee${createdCount > 1 ? 's' : ''}`, type: 'success' })
        } else if (createdCount > 0 && skippedCount > 0) {
          setToast({ message: `Marked: ${createdCount}, Skipped: ${skippedCount} (already marked)`, type: 'success' })
        } else if (createdCount === 0 && skippedCount > 0) {
          setToast({ message: `All ${skippedCount} employees already have attendance marked`, type: 'error' })
        }
      } else {
        setToast({ message: 'Attendance marked successfully', type: 'success' })
      }
      refetch()
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await editAttendance(id, { status })
      setToast({ message: 'Attendance updated successfully', type: 'success' })
      refetch()
    } catch (err) {
      setToast({ message: err.message, type: 'error' })
    }
  }

  const employeeOptions = employees.map((e) => ({
    value: e.employee_id,
    label: e.full_name,
  }))

  const handleEmployeeFilterChange = (selectedIds) => {
    setFilters((prev) => ({ ...prev, employeeIds: selectedIds }))
  }

  const handleDateFilterChange = ({ from, to }) => {
    setFilters((prev) => ({ ...prev, dateFrom: from, dateTo: to }))
  }

  const handleStatusFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value || null }))
  }

  const handleResetFilters = () => {
    setFilters(initialFilters)
  }

  const hasActiveFilters = filters.employeeIds.length > 0 || filters.dateFrom || filters.dateTo || filters.status

  if (loading || employeesLoading) {
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
        <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
        <Button onClick={() => setIsMarkModalOpen(true)} disabled={employees.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Mark Attendance
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-72">
            <MultiSelect
              label="Employees"
              options={employeeOptions}
              value={filters.employeeIds}
              onChange={handleEmployeeFilterChange}
              placeholder="Select employees..."
              allLabel="All Employees"
            />
          </div>
          <div className="w-72">
            <DateRangeFilter
              label="Date Range"
              value={{ from: filters.dateFrom, to: filters.dateTo }}
              onChange={handleDateFilterChange}
            />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status || ''}
              onChange={handleStatusFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={handleResetFilters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-50">
            <UserCheck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Records</p>
            <p className="text-2xl font-semibold text-gray-900">{summary.present + summary.absent}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="p-3 rounded-full bg-green-50">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Present</p>
            <p className="text-2xl font-semibold text-green-600">{summary.present}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
          <div className="p-3 rounded-full bg-red-50">
            <UserX className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Absent</p>
            <p className="text-2xl font-semibold text-red-600">{summary.absent}</p>
          </div>
        </div>
      </div>

      {attendance.length === 0 ? (
        <EmptyState
          title="No attendance records"
          description={
            hasActiveFilters
              ? 'No records match your filters.'
              : 'Start by marking attendance for your employees.'
          }
          action={
            employees.length > 0 && (
              <Button onClick={() => setIsMarkModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
            )
          }
        />
      ) : (
        <AttendanceTable attendance={attendance} onStatusChange={handleStatusChange} />
      )}

      <Modal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        title="Mark Attendance"
      >
        <MarkAttendanceForm
          employees={employees}
          onSubmit={handleMarkAttendance}
          onCancel={() => setIsMarkModalOpen(false)}
          loading={isSubmitting}
        />
      </Modal>

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
