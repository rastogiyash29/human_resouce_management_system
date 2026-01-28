import { AlertCircle } from 'lucide-react'
import Button from './Button'

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">Error</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
      {onRetry && (
        <div className="mt-6">
          <Button onClick={onRetry}>Try Again</Button>
        </div>
      )}
    </div>
  )
}
