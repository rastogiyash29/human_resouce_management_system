import { useState, useEffect, useCallback } from 'react'
import { getAttendance, markAttendance, markBulkAttendance, updateAttendance } from '../api/attendance'

export function useAttendance(filters = {}) {
  const [attendance, setAttendance] = useState([])
  const [summary, setSummary] = useState({ present: 0, absent: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {}
      if (filters.employeeIds?.length) params.employee_ids = filters.employeeIds
      if (filters.dateFrom) params.date_from = filters.dateFrom
      if (filters.dateTo) params.date_to = filters.dateTo
      if (filters.status) params.status = filters.status
      const data = await getAttendance(params)
      setAttendance(data.attendance)
      setSummary({
        present: data.present_count || 0,
        absent: data.absent_count || 0,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  const addAttendance = async (attendanceData) => {
    // Support both single and bulk attendance
    if (attendanceData.employee_ids) {
      const result = await markBulkAttendance(attendanceData)
      if (result.created.length > 0) {
        setAttendance((prev) => [...result.created, ...prev])
      }
      return result
    } else {
      const newAttendance = await markAttendance(attendanceData)
      setAttendance((prev) => [newAttendance, ...prev])
      return newAttendance
    }
  }

  const editAttendance = async (id, data) => {
    const updated = await updateAttendance(id, data)
    setAttendance((prev) =>
      prev.map((a) => (a.id === id ? updated : a))
    )
    return updated
  }

  useEffect(() => {
    fetchAttendance()
  }, [fetchAttendance])

  return {
    attendance,
    summary,
    loading,
    error,
    refetch: fetchAttendance,
    addAttendance,
    editAttendance,
  }
}
