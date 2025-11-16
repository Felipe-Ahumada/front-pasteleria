import { beforeEach, describe, expect, it } from 'vitest'
import { hideOffcanvas } from '@/utils/offcanvas'

describe('hideOffcanvas', () => {
	const elementId = 'login-offcanvas'

	beforeEach(() => {
		document.body.innerHTML = ''
		document.body.className = ''
		document.body.removeAttribute('data-bs-overflow')
		document.body.removeAttribute('data-bs-padding-right')
		document.body.style.cssText = ''
		delete (window as { bootstrap?: unknown }).bootstrap
	})

	it('manually cleans the DOM when the bootstrap instance is missing', () => {
		const offcanvas = document.createElement('div')
		offcanvas.id = elementId
		offcanvas.classList.add('show')
		offcanvas.setAttribute('aria-hidden', 'false')
		offcanvas.style.visibility = 'visible'
		document.body.appendChild(offcanvas)

		const backdrop = document.createElement('div')
		backdrop.classList.add('offcanvas-backdrop', 'show')
		document.body.appendChild(backdrop)

		document.body.classList.add('offcanvas-open')
		document.body.style.setProperty('overflow', 'hidden')
		document.body.setAttribute('data-bs-overflow', 'true')
		document.body.setAttribute('data-bs-padding-right', '15px')

		hideOffcanvas(elementId)

		expect(offcanvas.classList.contains('show')).toBe(false)
		expect(offcanvas.getAttribute('aria-hidden')).toBe('true')
		expect(offcanvas.style.visibility).toBe('hidden')

		expect(document.querySelector('.offcanvas-backdrop')).toBeNull()
		expect(document.body.classList.contains('offcanvas-open')).toBe(false)
		expect(document.body.style.overflow).toBe('')
		expect(document.body.hasAttribute('data-bs-overflow')).toBe(false)
		expect(document.body.hasAttribute('data-bs-padding-right')).toBe(false)
	})
})
