import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CalendarView from '../components/CalendarView'
import type { EventItem } from '../types'
import { addMonths, format } from 'date-fns'

const now = new Date(2025, 9, 20) // Oct 20, 2025
const events: EventItem[] = [
  { id: 'e1', name: 'Event 1', date: '2025-10-21T00:30:00Z', location: 'Loc A' },
]

describe('CalendarView', () => {
  test('renders month header and event buttons and triggers onSelect', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    // render calendar; it uses internal current month, but event date 2025-10 should appear
    render(<CalendarView events={events} onSelect={onSelect} />)

    // expect month header is shown
    expect(screen.getByText(/2025/)).toBeInTheDocument()

    // find event button and click
    const btn = await screen.findByRole('button', { name: /Event 1/i })
    await user.click(btn)
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'e1' }))
  })
})
