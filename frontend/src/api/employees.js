import api from './index'

export const getEmployees = async () => {
  const response = await api.get('/api/v1/employees')
  return response.data
}

export const getEmployee = async (employeeId) => {
  const response = await api.get(`/api/v1/employees/${employeeId}`)
  return response.data
}

export const createEmployee = async (employeeData) => {
  const response = await api.post('/api/v1/employees', employeeData)
  return response.data
}

export const deleteEmployee = async (employeeId) => {
  await api.delete(`/api/v1/employees/${employeeId}`)
}
