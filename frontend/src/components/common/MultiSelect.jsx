import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X, Check } from 'lucide-react'

export default function MultiSelect({
  label,
  options,
  value = [],
  onChange,
  placeholder = 'Select...',
  allLabel = 'All',
  selectAllBehavior = 'clear', // 'clear' = empty array means all, 'select' = select all items
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const allValues = options.map((o) => o.value)
  const isAllSelected = selectAllBehavior === 'clear'
    ? value.length === 0
    : value.length === options.length
  const selectedOptions = options.filter((opt) => value.includes(opt.value))

  const handleToggleOption = (optionValue) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const handleSelectAll = () => {
    if (selectAllBehavior === 'clear') {
      onChange([])
    } else {
      // Toggle: if all selected, clear; otherwise select all
      if (isAllSelected) {
        onChange([])
      } else {
        onChange(allValues)
      }
    }
  }

  const handleRemove = (optionValue, e) => {
    e.stopPropagation()
    onChange(value.filter((v) => v !== optionValue))
  }

  const displayAsAll = selectAllBehavior === 'clear' ? value.length === 0 : isAllSelected

  return (
    <div className="relative" ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        className="w-full min-h-[42px] px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white cursor-pointer flex items-center justify-between gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {displayAsAll ? (
            <span className="text-gray-700">{allLabel}</span>
          ) : selectedOptions.length > 0 ? (
            selectedOptions.map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-sm rounded"
              >
                {opt.label}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-blue-600"
                  onClick={(e) => handleRemove(opt.value, e)}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div
            className={`px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
              displayAsAll ? 'bg-blue-50' : ''
            }`}
            onClick={handleSelectAll}
          >
            <span className="font-medium">{allLabel}</span>
            {displayAsAll && <Check className="h-4 w-4 text-blue-600" />}
          </div>
          <div className="border-t border-gray-200" />
          {options.map((option) => {
            const isSelected = value.includes(option.value)
            return (
              <div
                key={option.value}
                className={`px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleToggleOption(option.value)}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="h-4 w-4 text-blue-600" />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
