"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface CalendarProps {
  mode?: "single" | "range"
  selected?: Date | { from?: Date; to?: Date }
  onSelect?: (date: Date | { from?: Date; to?: Date } | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
  initialFocus?: boolean
}

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

function Calendar({
  mode = "single",
  selected,
  onSelect,
  disabled,
  className,
  initialFocus,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    if (mode === "single" && selected instanceof Date) {
      return new Date(selected.getFullYear(), selected.getMonth(), 1)
    }
    if (mode === "range" && selected && typeof selected === 'object' && 'from' in selected && selected.from) {
      return new Date(selected.from.getFullYear(), selected.from.getMonth(), 1)
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const isSelected = (date: Date) => {
    if (mode === "single") {
      return selected instanceof Date && 
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear()
    }
    if (mode === "range" && selected && typeof selected === 'object' && 'from' in selected) {
      const { from, to } = selected
      if (from && to) {
        return date >= from && date <= to
      }
      if (from) {
        return date.getTime() === from.getTime()
      }
    }
    return false
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }

  const handleDateClick = (date: Date) => {
    if (disabled && disabled(date)) return

    if (mode === "single") {
      onSelect?.(date)
    } else if (mode === "range") {
      const currentSelection = selected as { from?: Date; to?: Date } | undefined
      if (!currentSelection?.from) {
        onSelect?.({ from: date, to: undefined })
      } else if (!currentSelection.to) {
        if (date >= currentSelection.from) {
          onSelect?.({ from: currentSelection.from, to: date })
        } else {
          onSelect?.({ from: date, to: undefined })
        }
      } else {
        onSelect?.({ from: date, to: undefined })
      }
    }
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const days = getDaysInMonth(currentMonth)

  return (
    <div className={cn("p-4 bg-white rounded-lg border shadow-sm", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToPreviousMonth}
          className="h-8 w-8 p-0"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
        
        <h2 className="text-sm font-semibold">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToNextMonth}
          className="h-8 w-8 p-0"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="aspect-square">
            {date ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDateClick(date)}
                disabled={disabled && disabled(date)}
                className={cn(
                  "h-full w-full p-0 font-normal text-sm",
                  isSelected(date) && "bg-blue-600 text-white hover:bg-blue-700",
                  isToday(date) && !isSelected(date) && "bg-blue-100 text-blue-600",
                  disabled && disabled(date) && "opacity-50 cursor-not-allowed"
                )}
              >
                {date.getDate()}
              </Button>
            ) : (
              <div />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }