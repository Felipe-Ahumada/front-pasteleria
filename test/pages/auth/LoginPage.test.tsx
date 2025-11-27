import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
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

describe('LoginPage snapshots', () => {
	beforeEach(() => {
		loginMock.mockReset()
		loadingState = false
	})

	it('renders the default state as expected', () => {
		renderLoginPage()
		const heading = screen.getByRole('heading', { name: /Iniciar sesión/i })
		const emailInput = screen.getByLabelText('Correo electrónico') as HTMLInputElement
		const passwordInput = screen.getByLabelText('Contraseña') as HTMLInputElement
		const rememberMe = screen.getByLabelText('Recordarme') as HTMLInputElement
		const submitButton = screen.getByRole('button', { name: /Ingresar/i })
		const forgotPasswordLink = screen.getByRole('link', { name: /Olvidaste tu contraseña/i })
		const registerLink = screen.getByRole('link', { name: /Crear cuenta/i })
		const closeLink = screen.getByRole('link', { name: /Cerrar/i })

		const snapshot = {
			heading: heading.textContent?.replace(/\s+/g, ' ').trim(),
			email: {
				value: emailInput.value,
				invalid: isInvalid(emailInput),
			},
			password: {
				value: passwordInput.value,
				type: passwordInput.type,
				invalid: isInvalid(passwordInput),
			},
			rememberMeChecked: rememberMe.checked,
			submit: {
				label: submitButton.textContent?.trim(),
				disabled: submitButton.hasAttribute('disabled'),
			},
			links: {
				forgotPassword: forgotPasswordLink.getAttribute('href'),
				register: registerLink.getAttribute('href'),
				close: closeLink.getAttribute('href'),
			},
		}

		expect(snapshot).toMatchInlineSnapshot(`
		  {
		    "email": {
		      "invalid": false,
		      "value": "",
		    },
		    "heading": "Iniciar sesión",
		    "links": {
		      "close": "/",
		      "forgotPassword": "/reset-password",
		      "register": "/register",
		    },
		    "password": {
		      "invalid": false,
		      "type": "password",
		      "value": "",
		    },
		    "rememberMeChecked": false,
		    "submit": {
		      "disabled": false,
		      "label": "Ingresar",
		    },
		  }
		`)
	})
})
