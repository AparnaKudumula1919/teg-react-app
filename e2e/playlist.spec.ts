import { test, expect } from '@playwright/test'

// small deterministic fixture: one venue + one event in Oct 2025
const fixture = {
  venues: [
    { id: 'v1', name: 'TEG Stadium', location: 'Main Stage' }
  ],
  events: [
    {
      id: 'e1',
      name: 'Event 1',
      startDate: '2025-10-21T19:00:00Z', // October 2025
      venueId: 'v1',
      location: 'Hall A',
      description: 'Fixture event for testing'
    }
  ]
}



test.describe('TEG Events App - E2E', () => {
  test.beforeEach(async ({ page }) => {
    // intercept the network request BEFORE navigation
    await page.route('**/event-data.json', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fixture),
      })
    )

    // now navigate — app will receive the mocked fixture
    await page.goto('/')
    await expect(page.getByText('TEG Events')).toBeVisible()

    // sanity check: app should indicate remote source if you map that in UI
    // (optional) await expect(page.getByText(/Source: remote/i)).toBeVisible()
  })

  test('venue selection filters list and details show location', async ({ page }) => {
 // get the select locator
const venueSelect = page.getByLabel('Choose venue')
await expect(venueSelect).toBeVisible()

// wait until the select has more than one option (avoids 'option visible' flakiness)
// use page.waitForFunction to check the DOM directly (works for hidden option elements)
await page.waitForFunction(() => {
  const el = document.querySelector('#venue')
  return el && el.querySelectorAll('option').length > 1
}, { timeout: 10_000 })

// now safely read option labels (they may still be hidden, but their text is available)
const optionLabels = await venueSelect.locator('option').allTextContents()
console.log('venue options:', optionLabels)

// select by visible label (robust if value attributes are unstable)
await venueSelect.selectOption({ label: 'TEG Stadium' })

// assert the list is filtered — check the first article's venue label
const firstArticle = page.locator('article').first()
await expect(firstArticle.locator('strong')).toHaveText(/TEG Stadium/i)

})

  test('calendar view shows events and clicking opens details with location', async ({ page }) => {
    // switch to calendar view
    await page.getByLabel('View mode').selectOption('calendar')

    // wait for month header that contains October 2025
    await expect(page.getByRole('heading', { name: /October 2025/ })).toBeVisible()

    // find the event button (fixture guarantees it exists)
    const evtBtn = page.getByRole('button', { name: /Event 1/ })
    await expect(evtBtn).toBeVisible()
    await evtBtn.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('Hall A')).toBeVisible()

    // close dialog
    await dialog.getByLabel('Close').click()
    await expect(dialog).not.toBeVisible()
  })
})

