import React, { useState } from 'react'
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, format, isSameMonth,
  isSameDay, parseISO, isValid
} from 'date-fns'
import type { EventItem } from '../types'

export default function CalendarView({ events, onSelect }: {
  events: EventItem[]
  onSelect: (e: EventItem) => void
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const renderHeader = () => (
    <div className="calendar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
      <button onClick={prevMonth} aria-label="Previous month">←</button>
      <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
      <button onClick={nextMonth} aria-label="Next month">→</button>
    </div>
  )

  const renderDays = () => {
    const days = []
    const weekStart = startOfWeek(new Date())
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} style={{ flex: 1, textAlign: 'center', fontWeight: 600 }}>
          {format(addDays(weekStart, i), 'EEE')}
        </div>
      )
    }
    return <div style={{ display: 'flex' }}>{days}</div>
  }

  const renderCells = () => {
    const rows: JSX.Element[] = []
    let day = startDate
    const dateFormat = 'd'
    let daysRow: JSX.Element[] = []

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        const dayEvents = events.filter(e => {
          if (!e.date && !e.startDate) return false
          try {
            const d = parseISO(e.date ?? e.startDate!)
            return isValid(d) && isSameDay(d, cloneDay)
          } catch {
            return false
          }
        })

        daysRow.push(
          <div
            key={day.toString()}
            style={{
              flex: 1,
              minHeight: 90,
              border: '1px solid #f0f0f0', // keep day grid
              padding: 6,
              overflow: 'hidden',
              background: isSameMonth(day, monthStart) ? '#fff' : '#fafafa'
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700 }}>{format(day, dateFormat)}</div>

            <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {dayEvents.map(evt => (
                <button
                  key={evt.id}
                  onClick={() => onSelect(evt)}
                  style={{
                    textAlign: 'left',
                    border: 'none',
                    background: 'none',
                    color: '#333',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    lineHeight: 1.2,
                    padding: 0
                  }}
                  title={`${evt.name ?? 'Untitled event'} — ${evt.location ?? ''}`}
                  onMouseOver={e => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseOut={e => (e.currentTarget.style.textDecoration = 'none')}
                >
                  • {evt.name ?? 'Untitled event'}
                </button>
              ))}
            </div>
          </div>
        )

        day = addDays(day, 1)
      }
      rows.push(<div key={day.toString()} style={{ display: 'flex' }}>{daysRow}</div>)
      daysRow = []
    }

    return <div>{rows}</div>
  }

  return (
    <div className="calendar card">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  )
}
