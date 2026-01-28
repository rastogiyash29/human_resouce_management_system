import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Input from '../common/Input'
import Select from '../common/Select'
import MultiSelect from '../common/MultiSelect'
import Button from '../common/Button'

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function MarkAttendanceForm({ employees, onSubmit, onCancel, loading }) {
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [employeeError, setEmployeeError] = useState('')

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: getLocalDateString(),
      status: 'Present',
    },
  })

  const employeeOptions = employees.map((e) => ({
    value: e.employee_id,
    label: e.full_name,
  }))

  const statusOptions = [
    { value: 'Present', label: 'Present' },
    { value: 'Absent', label: 'Absent' },
  ]

  const today = getLocalDateString()

  const handleFormSubmit = async (data) => {
    if (selectedEmployees.length === 0) {
      setEmployeeError('Please select at least one employee')
      return
    }
    setEmployeeError('')

    // Submit for each selected employee
    await onSubmit({
      employee_ids: selectedEmployees,
      date: data.date,
      status: data.status,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <MultiSelect
          label="Employees"
          options={employeeOptions}
          value={selectedEmployees}
          onChange={(ids) => {
            setSelectedEmployees(ids)
            if (ids.length > 0) setEmployeeError('')
          }}
          placeholder="Select employees..."
          allLabel="Select All"
          selectAllBehavior="select"
        />
        {employeeError && <p className="mt-1 text-sm text-red-600">{employeeError}</p>}
        {selectedEmployees.length > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            {selectedEmployees.length} employee{selectedEmployees.length > 1 ? 's' : ''} selected
          </p>
        )}
      </div>
      <Input
        label="Date"
        type="date"
        max={today}
        error={errors.date?.message}
        {...register('date', {
          required: 'Date is required',
          validate: (value) =>
            value <= today || 'Cannot mark attendance for future dates',
        })}
      />
      <Select
        label="Status"
        options={statusOptions}
        error={errors.status?.message}
        {...register('status', {
          required: 'Status is required',
        })}
      />
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Mark Attendance
        </Button>
      </div>
    </form>
  )
}
