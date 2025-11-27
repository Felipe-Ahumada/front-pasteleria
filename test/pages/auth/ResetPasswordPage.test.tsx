import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'

const renderResetPasswordPage = () =>
	render(
		<MemoryRouter initialEntries={["/reset-password"]}>
			<ResetPasswordPage />
		</MemoryRouter>,
	)

const isInvalidField = (element: HTMLElement) => element.classList.contains('is-invalid')

describe('ResetPasswordPage snapshots', () => {
	it('renders the initial form state', () => {
		renderResetPasswordPage()
		const heading = screen.getByRole('heading', { name: /Restablecer contraseña/i })
		const emailInput = screen.getByLabelText('Correo electrónico') as HTMLInputElement
		const newPasswordInput = screen.getByLabelText('Nueva contraseña', {
			selector: 'input',
		}) as HTMLInputElement
		const confirmPasswordInput = screen.getByLabelText('Confirmar contraseña', {
			selector: 'input',
		}) as HTMLInputElement
		const submitButton = screen.getByRole('button', { name: /Restablecer contraseña/i })
		const loginLink = screen.getByRole('link', { name: /Volver al inicio de sesión/i })

		const snapshot = {
			heading: heading.textContent?.replace(/\s+/g, ' ').trim(),
			email: {
				value: emailInput.value,
				invalid: emailInput.getAttribute('aria-invalid') === 'true',
			},
			nuevaContraseña: {
				value: newPasswordInput.value,
				type: newPasswordInput.type,
				invalid: isInvalidField(newPasswordInput),
			},
			confirmacion: {
				value: confirmPasswordInput.value,
				type: confirmPasswordInput.type,
				invalid: isInvalidField(confirmPasswordInput),
			},
			submit: {
				label: submitButton.textContent?.trim(),
				disabled: submitButton.hasAttribute('disabled'),
			},
			loginHref: loginLink.getAttribute('href'),
		}

		expect(snapshot).toMatchInlineSnapshot(`
		  {
		    "confirmacion": {
		      "invalid": false,
		      "type": "password",
		      "value": "",
		    },
		    "email": {
		      "invalid": false,
		      "value": "",
		    },
		    "heading": "Restablecer contraseña",
		    "loginHref": "/login",
		    "nuevaContraseña": {
		      "invalid": false,
		      "type": "password",
		      "value": "",
		    },
		    "submit": {
		      "disabled": false,
		      "label": "Restablecer contraseña",
		    },
		  }
		`)
	})
})
