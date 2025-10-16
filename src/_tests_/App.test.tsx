// src/__tests__/App.test.tsx
import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

// mock the API module so tests are deterministic
vi.mock('../api', () => {
  return {
    getEventData: async () => {
      // sample mapped shape: venues with events attached
      return {
        data: {
          venues: [
            {
              id: 'v1',
              name: 'Venue One',
              events: [
                {
                  id: 'e1',
                  name: 'Event 1',
                  startDate: '2025-10-20T19:00:00Z',
                  date: '2025-10-20T19:00:00Z',
                  location: 'Hall A',
                  venueId: 'v1',
                  venue_id: 'v1',
                  venue_name: 'Venue One',
                },
                {
                  id: 'e1b',
                  name: 'Event 1B',
                  startDate: '2025-11-01T18:30:00Z',
                  date: '2025-11-01T18:30:00Z',
                  location: 'Room 2',
                  venueId: 'v1',
                  venue_id: 'v1',
                  venue_name: 'Venue One',
                }
              ]
            },
            {
              id: 'v2',
              name: 'Venue Two',
              events: [
                {
                  id: 'e2',
                  name: 'Event 2',
                  startDate: '2025-10-22T20:00:00Z',
                  date: '2025-10-22T20:00:00Z',
                  location: 'Main Stage',
                  venueId: 'v2',
                  venue_id: 'v2',
                  venue_name: 'Venue Two',
                }
              ]
            }
          ]
        },
        source: 'remote'
      }
    }
  }
})

import App from '../App'

describe('TEG Events App UI', () => {
  test('loads venues and displays all events, filters by venue selection', async () => {
    render(<App />)

    // Loading indicator appears
    expect(screen.getByText(/Loading events/i)).toBeInTheDocument()

    // wait for the venue selector to be displayed after data load
    await waitFor(() => expect(screen.getByLabelText(/Choose venue/i)).toBeInTheDocument())

    const select = screen.getByLabelText(/Choose venue/i) as HTMLSelectElement

    // All Venues default -> should display 3 events in list (two in v1 + one in v2)
    // Ensure List View is active (ViewToggle default is 'list')
    // The grid cards show event names
    const eventCards = await screen.findAllByRole('article')
    expect(eventCards.length).toBeGreaterThanOrEqual(3)

    // Filter to Venue One
    await userEvent.selectOptions(select, 'v1')
    // Wait for list to update
    await waitFor(async () => {
      const v1Cards = screen.getAllByText(/Event 1|Event 1B/)
      expect(v1Cards.length).toBeGreaterThanOrEqual(1)
    })

    // Filter to Venue Two
    await userEvent.selectOptions(select, 'v2')
    await waitFor(() => {
      expect(screen.getByText('Event 2')).toBeInTheDocument()
      // Event 1 should not be present when v2 is selected
      expect(screen.queryByText('Event 1')).not.toBeInTheDocument()
    })

    // Reset to All venues
    await userEvent.selectOptions(select, '')
    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument()
      expect(screen.getByText('Event 2')).toBeInTheDocument()
    })
  })

 test('calendar view shows events and clicking opens details modal with location', async () => {
  render(<App />)

  // wait for data load
  await waitFor(() => expect(screen.getByLabelText(/Choose venue/i)).toBeInTheDocument())

  // switch to Calendar view
  const viewSelect = screen.getByLabelText(/View mode/i) as HTMLSelectElement
  await userEvent.selectOptions(viewSelect, 'calendar')

  // wait for calendar title to appear
  await screen.findByText(/October 2025/)

  // find the event button by its visible name and click it
  // note: calendar event buttons render the event name, so this should match
  const evtBtn = await screen.findByRole('button', { name: /Event 1/i })
  await userEvent.click(evtBtn)

  // now wait for the dialog to appear
  const dialog = await screen.findByRole('dialog')
  // scope subsequent assertions to the dialog to avoid ambiguous matches
  const modal = within(dialog)

  // assert modal shows the event name and location
  expect(modal.getByText('Event 1')).toBeInTheDocument()
  expect(modal.getByText('Hall A')).toBeInTheDocument()

  // assert the date inside the dialog — scope to the dialog to avoid matching the header
  // adapt this to the exact formatted string your app shows; this example matches the prefix year
  expect(modal.getByText(/2025/)).toBeInTheDocument()

  // close modal
  const closeBtn = modal.getByLabelText('Close')
  await userEvent.click(closeBtn)
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
})

})