'use client'

import { useState, useEffect, useRef } from 'react'
import { BsCaretDownFill } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'

export interface SelectProps {
  defaultValue: string
  items: string[]
  onChange: (value: string) => void
}

export const Select: React.FC<SelectProps> = ({ defaultValue, items, onChange }) => {
  const [selectedItem, setSelectedItem] = useState<string>(defaultValue)
  const [hideDropdown, setHideDropdown] = useState<boolean>(true)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectItems = [defaultValue, ...items]

  const handleOnSelectClick = () => {
    setHideDropdown((prev) => !prev)
  }

  const handleOnOptionClick = (item: string) => {
    setHideDropdown(true)
    setSelectedItem(item)
    onChange(item)
  }

  const handleClear = () => {
    setSelectedItem(defaultValue)
    onChange(defaultValue)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setHideDropdown(true)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={selectRef}>
      {/* Select Bar */}
      <div
        className={`${hideDropdown ? 'rounded shadow' : 'rounded-t-sm'} flex cursor-pointer items-center justify-between bg-neutral-50 px-4 py-1`}
        onClick={handleOnSelectClick}
        data-testid="select"
      >
        <span className="text-xl font-medium text-gray-950">{selectedItem}</span>

        <div className="flex items-center space-x-2">
          {/* Clear Button */}
          {selectedItem !== defaultValue && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="rounded p-1 text-gray-500 hover:cursor-pointer hover:bg-gray-200 hover:text-gray-900"
              aria-label="Clear selection"
              data-testid="clear-button"
            >
              <IoClose className="h-5 w-5 text-2xl" />
            </button>
          )}

          {/* Dropdown icon */}
          <BsCaretDownFill
            className={`font-bold text-gray-950 transition-transform ${hideDropdown ? '' : 'rotate-180'}`}
            data-testid="dropdown-icon"
          />
        </div>
      </div>

      {/* Dropdown */}
      <div
        className={`${hideDropdown ? 'hidden shadow' : ''} absolute z-10 w-full`}
        hidden={hideDropdown}
        data-testid="select-dropdown"
      >
        {selectItems
          .filter((item) => item !== selectedItem)
          .map((item, index, arr) => (
            <div
              key={index}
              onClick={() => handleOnOptionClick(item)}
              className={`hover:text-neutral-light cursor-pointer bg-neutral-50 px-4 py-1 text-gray-950 hover:bg-orange-600 ${
                index === arr.length - 1 ? 'rounded-b shadow' : ''
              }`}
              data-testid="select-option"
            >
              <span className="text-xl font-medium">{item}</span>
            </div>
          ))}
      </div>
    </div>
  )
}
