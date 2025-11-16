import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import LoginPage from '@/pages/auth/LoginPage'
import type { StoredUser } from '@/types/user'

const loginMock = vi.fn(async () => {})
let loadingState = false

const usersFixture: StoredUser[] = [
	{
		id: 'user-1',
		run: '19011022K',
		nombre: 'María',
		apellidos: 'González',
		correo: 'dulce@duoc.cl',
		fechaNacimiento: '1995-05-10',
		tipoUsuario: 'Cliente',
		regionId: '13',
		regionNombre: 'Metropolitana',
		comuna: 'Santiago',
		direccion: 'Av. Siempre Viva 123',
		password: 'hash-secreto',
		avatarUrl: undefined,
		createdAt: '2024-01-01T10:00:00.000Z',
		updatedAt: '2024-01-01T10:00:00.000Z',
	},
]

vi.mock('@/hooks/useAuth', () => ({
	default: () => ({ login: loginMock, loading: loadingState }),
}))

vi.mock('@/utils/storage/localStorageUtils', () => ({
	getLocalData: () => usersFixture,
}))

const renderLoginPage = () =>
	render(
		<MemoryRouter initialEntries={["/login"]}>
			<LoginPage />
		</MemoryRouter>,
	)

const isInvalid = (element: HTMLElement) => element.getAttribute('aria-invalid') === 'true'

describe('LoginPage snapshots - feedback', () => {
	beforeEach(() => {
		loginMock.mockReset()
		loadingState = false
	})

	it('renders feedback after a failed login attempt', async () => {
		const errorMessage = 'Credenciales inválidas'
		loginMock.mockRejectedValueOnce(new Error(errorMessage))

		renderLoginPage()
		const emailInput = screen.getByLabelText('Correo electrónico') as HTMLInputElement
		const passwordInput = screen.getByLabelText('Contraseña') as HTMLInputElement
		const submitButton = screen.getByRole('button', { name: /Ingresar/i })

		fireEvent.change(emailInput, { target: { value: 'dulce@duoc.cl' } })
		fireEvent.change(passwordInput, { target: { value: 'secreto' } })
		const form = submitButton.closest('form')
		if (!form) {
			throw new Error('No se encontró el formulario de inicio de sesión')
		}
		fireEvent.submit(form)

		await waitFor(() => {
			expect(screen.getByRole('alert')).toBeDefined()
		})

		const alert = screen.getByRole('alert')
		const snapshot = {
			email: {
				value: emailInput.value,
				invalid: isInvalid(emailInput),
			},
			password: {
				value: passwordInput.value,
				invalid: isInvalid(passwordInput),
			},
			formError: alert.textContent?.trim(),
			submitDisabled: submitButton.hasAttribute('disabled'),
			loginCalls: loginMock.mock.calls.length,
		}

		expect(snapshot).toMatchInlineSnapshot(`
		  {
		    "email": {
		      "invalid": false,
		      "value": "dulce@duoc.cl",
		    },
		    "formError": "Credenciales inválidas",
		    "loginCalls": 1,
		    "password": {
		      "invalid": false,
		      "value": "secreto",
		    },
		    "submitDisabled": false,
		  }
		`)
	})
})
