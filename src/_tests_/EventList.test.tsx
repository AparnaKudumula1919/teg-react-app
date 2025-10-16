import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EventList from '../components/EventList'
import type { EventItem } from '../types'

const events: EventItem[] = [
  { id: 'e1', name: 'E1', date: '2025-10-20T19:00:00Z', location: 'Loc A', venue_name: 'V1' },
  { id: 'e2', name: 'E2', date: '2025-10-21T19:00:00Z', location: 'Loc B', venue_name: 'V1' }
]

describe('EventList', () => {
  test('renders events and calls onSelect when clicked', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<EventList events={events} onSelect={onSelect} />)

    expect(screen.getByText('E1')).toBeInTheDocument()
    expect(screen.getByText('Loc A')).toBeInTheDocument()

    await user.click(screen.getByText('E1'))
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'e1' }))
  })
})
