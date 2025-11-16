import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'

import ScrollToTop from '@/components/ScrollToTop'

describe('ScrollToTop', () => {
	const originalScrollTo = window.scrollTo
	const scrollToMock = vi.fn()

	beforeEach(() => {
		scrollToMock.mockClear()
		// Stub the browser scroll function so we can assert the effect usage.
		Object.defineProperty(window, 'scrollTo', {
			configurable: true,
			writable: true,
			value: scrollToMock,
		})
	})

	afterEach(() => {
		if (originalScrollTo) {
			Object.defineProperty(window, 'scrollTo', {
				configurable: true,
				writable: true,
				value: originalScrollTo,
			})
			return
		}

		Reflect.deleteProperty(window, 'scrollTo')
	})

	it('calls scrollTo on initial render and when the route changes', async () => {
		const user = userEvent.setup()

		render(
			<MemoryRouter initialEntries={['/inicio']}>
				<ScrollToTop />
				<Routes>
					<Route path="/inicio" element={<Link to="/otra">Ir a otra página</Link>} />
					<Route path="/otra" element={<div>Otra página</div>} />
				</Routes>
			</MemoryRouter>,
		)

		expect(scrollToMock).toHaveBeenCalledTimes(1)
		expect(scrollToMock).toHaveBeenLastCalledWith({ left: 0, top: 0 })

		await user.click(screen.getByRole('link', { name: /otra página/i }))
		await screen.findByText('Otra página')

		expect(scrollToMock).toHaveBeenCalledTimes(2)
		expect(scrollToMock).toHaveBeenLastCalledWith({ left: 0, top: 0 })
	})
})
