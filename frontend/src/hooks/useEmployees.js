import { useState, useEffect, useCallback } from 'react'
import { getEmployees, createEmployee, deleteEmployee } from '../api/employees'

export function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getEmployees()
      setEmployees(data.employees)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const addEmployee = async (employeeData) => {
    const newEmployee = await createEmployee(employeeData)
    setEmployees((prev) => [newEmployee, ...prev])
    return newEmployee
  }

  const removeEmployee = async (employeeId) => {
    await deleteEmployee(employeeId)
    setEmployees((prev) => prev.filter((e) => e.employee_id !== employeeId))
  }

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployees,
    addEmployee,
    removeEmployee,
  }
}
