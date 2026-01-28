import { useState, useEffect } from 'react'
import { Users, UserCheck, UserX } from 'lucide-react'
import { getDashboardStats } from '../api/attendance'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorState from '../components/common/ErrorState'

function StatCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex items-center">
        <div className={`p-2 md:p-3 rounded-full ${colors[color]}`}>
          <Icon className="h-5 w-5 md:h-6 md:w-6" />
        </div>
        <div className="ml-3 md:ml-4">
          <p className="text-xs md:text-sm font-medium text-gray-500">{title}</p>
          <p className="text-xl md:text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDashboardStats()
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchStats} />
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
        <StatCard
          title="Total Employees"
          value={stats?.total_employees || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Present Today"
          value={stats?.present_today || 0}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Absent Today"
          value={stats?.absent_today || 0}
          icon={UserX}
          color="red"
        />
      </div>
    </div>
  )
}
