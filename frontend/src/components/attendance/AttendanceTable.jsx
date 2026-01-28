export default function AttendanceTable({ attendance, onStatusChange }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="hidden sm:table-cell px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee ID
              </th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendance.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="hidden sm:table-cell px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.employee_id}
                </td>
                <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.employee_name || record.employee_id}
                </td>
                <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(record.date)}
                </td>
                <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap">
                  <select
                    value={record.status}
                    onChange={(e) => onStatusChange(record.id, e.target.value)}
                    className={`text-xs md:text-sm font-medium rounded-full px-2 py-1 md:px-3 border-0 cursor-pointer ${
                      record.status === 'Present'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
