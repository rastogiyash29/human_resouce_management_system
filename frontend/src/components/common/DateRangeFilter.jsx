import { useState, useRef, useEffect, useMemo } from 'react'
import { ChevronDown, Calendar } from 'lucide-react'

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getPresetRanges() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  return {
    all: { label: 'All Time', from: null, to: null },
    today: {
      label: 'Today',
      from: formatDate(today),
      to: formatDate(today),
    },
    thisWeek: {
      label: 'This Week',
      from: formatDate(startOfWeek(today)),
      to: formatDate(today),
    },
    thisMonth: {
      label: 'This Month',
      from: formatDate(new Date(year, month, 1)),
      to: formatDate(today),
    },
    lastMonth: {
      label: 'Last Month',
      from: formatDate(new Date(year, month - 1, 1)),
      to: formatDate(new Date(year, month, 0)),
    },
    thisYear: {
      label: 'This Year',
      from: formatDate(new Date(year, 0, 1)),
      to: formatDate(today),
    },
    lastYear: {
      label: 'Last Year',
      from: formatDate(new Date(year - 1, 0, 1)),
      to: formatDate(new Date(year - 1, 11, 31)),
    },
    custom: { label: 'Custom Range', from: null, to: null },
  }
}

export default function DateRangeFilter({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const containerRef = useRef(null)

  const presets = useMemo(() => getPresetRanges(), [])
  const today = formatDate(new Date())

  // Determine which preset matches current value
  const activePreset = useMemo(() => {
    const { from, to } = value || {}

    // Check if matches any preset
    for (const [key, preset] of Object.entries(presets)) {
      if (key === 'custom') continue
      if (preset.from === from && preset.to === to) {
        return key
      }
    }

    // If has values but doesn't match any preset, it's custom
    if (from || to) {
      return 'custom'
    }

    return 'all'
  }, [value, presets])

  // Sync custom inputs with value when it's a custom range
  useEffect(() => {
    if (activePreset === 'custom') {
      setCustomFrom(value?.from || '')
      setCustomTo(value?.to || '')
    }
  }, [activePreset, value])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePresetSelect = (presetKey) => {
    if (presetKey === 'custom') {
      // When switching to custom, initialize with current values
      setCustomFrom(value?.from || '')
      setCustomTo(value?.to || '')
    } else {
      const preset = presets[presetKey]
      onChange({ from: preset.from, to: preset.to })
      setIsOpen(false)
    }
  }

  const handleCustomApply = () => {
    onChange({ from: customFrom || null, to: customTo || null })
    setIsOpen(false)
  }

  const getDisplayText = () => {
    if (!value?.from && !value?.to) return 'All Time'
    if (value.from === value.to) return formatDisplayDate(value.from)
    if (value.from && value.to) {
      return `${formatDisplayDate(value.from)} - ${formatDisplayDate(value.to)}`
    }
    if (value.from) return `From ${formatDisplayDate(value.from)}`
    if (value.to) return `Until ${formatDisplayDate(value.to)}`
    return 'All Time'
  }

  // Track if user clicked custom (for showing the inputs)
  const [showCustomInputs, setShowCustomInputs] = useState(false)

  const handlePresetClick = (presetKey) => {
    if (presetKey === 'custom') {
      setShowCustomInputs(true)
      setCustomFrom(value?.from || '')
      setCustomTo(value?.to || '')
    } else {
      setShowCustomInputs(false)
      handlePresetSelect(presetKey)
    }
  }

  // Show custom inputs if activePreset is custom or user clicked custom
  const shouldShowCustomInputs = showCustomInputs || activePreset === 'custom'

  // Reset showCustomInputs when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setShowCustomInputs(false)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer flex items-center justify-between gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-gray-700">{getDisplayText()}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-72 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2">
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(presets).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  className={`px-3 py-2 text-sm rounded text-left hover:bg-gray-100 ${
                    (key === 'custom' ? shouldShowCustomInputs : activePreset === key && !shouldShowCustomInputs)
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700'
                  }`}
                  onClick={() => handlePresetClick(key)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {shouldShowCustomInputs && (
            <div className="border-t border-gray-200 p-3">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    max={customTo || today}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    min={customFrom || undefined}
                    max={today}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCustomApply}
                  className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
