import { useForm } from 'react-hook-form'
import Input from '../common/Input'
import Button from '../common/Button'

export default function AddEmployeeForm({ onSubmit, onCancel, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Employee ID"
        placeholder="e.g., EMP-001"
        error={errors.employee_id?.message}
        {...register('employee_id', {
          required: 'Employee ID is required',
          pattern: {
            value: /^[a-zA-Z0-9_-]+$/,
            message: 'Only alphanumeric characters, hyphens, and underscores allowed',
          },
        })}
      />
      <Input
        label="Full Name"
        placeholder="e.g., John Doe"
        error={errors.full_name?.message}
        {...register('full_name', {
          required: 'Full name is required',
          minLength: { value: 1, message: 'Name is required' },
        })}
      />
      <Input
        label="Email"
        type="email"
        placeholder="e.g., john@example.com"
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email',
          },
        })}
      />
      <Input
        label="Department"
        placeholder="e.g., Engineering"
        error={errors.department?.message}
        {...register('department', {
          required: 'Department is required',
        })}
      />
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={onCancel} disabled={loading} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" loading={loading} className="w-full sm:w-auto">
          Add Employee
        </Button>
      </div>
    </form>
  )
}
