import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import Button from '@/components/common/Button'

describe('Button', () => {
	it('renders a router link with mint styling and handles clicks', async () => {
		const user = userEvent.setup()
		const handleClick = vi.fn()

		render(
			<MemoryRouter>
				<Button as="link" to="/menu" size="lg" block variant="mint" onClick={handleClick}>
					Ver menú
				</Button>
			</MemoryRouter>,
		)

		const link = screen.getByRole('link', { name: /ver menú/i })
		const className = link.className

		expect(className).toContain('btn')
		expect(className).toContain('btn-pastel')
		expect(className).toContain('btn-mint')
		expect(className).toContain('btn-lg')
		expect(className).toContain('w-100')
		expect(link.getAttribute('href')).toBe('/menu')

		await user.click(link)
		expect(handleClick).toHaveBeenCalledTimes(1)
	})
})
