import api from './index'

export const getAttendance = async (params = {}) => {
  const queryParams = new URLSearchParams()

  if (params.employee_ids?.length) {
    params.employee_ids.forEach(id => queryParams.append('employee_ids', id))
  }
  if (params.date_from) queryParams.append('date_from', params.date_from)
  if (params.date_to) queryParams.append('date_to', params.date_to)
  if (params.status) queryParams.append('status', params.status)

  const response = await api.get(`/api/v1/attendance?${queryParams.toString()}`)
  return response.data
}

export const getEmployeeAttendance = async (employeeId) => {
  const response = await api.get(`/api/v1/attendance/${employeeId}`)
  return response.data
}

export const markAttendance = async (attendanceData) => {
  const response = await api.post('/api/v1/attendance', attendanceData)
  return response.data
}

export const markBulkAttendance = async (data) => {
  const response = await api.post('/api/v1/attendance/bulk', data)
  return response.data
}

export const updateAttendance = async (id, data) => {
  const response = await api.put(`/api/v1/attendance/${id}`, data)
  return response.data
}

export const getDashboardStats = async () => {
  // Send client's local date to handle timezone differences
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`

  const response = await api.get(`/api/v1/dashboard/stats?today=${dateStr}`)
  return response.data
}
