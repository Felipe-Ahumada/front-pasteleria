import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import RegisterUserPage from '@/pages/auth/RegisterUserPage'
import type { RegionSeed } from '@/utils/storage/initLocalData'

const loginMock = vi.fn(async () => {})

const regionFixtures: RegionSeed[] = [
	{
		id: '13',
		region: 'Región Metropolitana de Santiago',
		comunas: ['Santiago', 'Providencia', 'Las Condes'],
	},
]

vi.mock('@/hooks/useAuth', () => ({
	default: () => ({ login: loginMock }),
}))

vi.mock('@/utils/storage/localStorageUtils', () => ({
	getLocalData: (key: string) => {
		if (key === 'dataRegiones') {
			return regionFixtures
		}
		return []
	},
	setLocalItem: vi.fn(),
	getLocalItem: vi.fn(),
}))

vi.mock('@/utils/validations/userValidations', () => ({
	MIN_AGE: 18,
	sanitizeNameField: (value: string) => value,
	validateUserForm: () => ({ isValid: true, errors: {} }),
	mapFormToStoredUser: (values: Record<string, string | boolean>) => ({
		id: 'new-user',
		run: String(values.run ?? ''),
		nombre: String(values.nombre ?? ''),
		apellidos: String(values.apellidos ?? ''),
		correo: String(values.correo ?? ''),
		tipoUsuario: 'Cliente',
		regionId: String(values.regionId ?? ''),
		regionNombre: 'Región Metropolitana de Santiago',
		comuna: String(values.comuna ?? ''),
		direccion: String(values.direccion ?? ''),
		password: String(values.password ?? ''),
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	}),
	saveUserRecord: vi.fn(),
}))

const renderRegisterPage = () =>
	render(
		<MemoryRouter initialEntries={["/register"]}>
			<RegisterUserPage />
		</MemoryRouter>,
	)

describe('RegisterUserPage snapshots', () => {
	beforeEach(() => {
		loginMock.mockReset()
	})

	it('captures a completed registration form state', async () => {
		renderRegisterPage()
		const user = userEvent.setup()

		const runBodyInput = screen.getByPlaceholderText('19011022') as HTMLInputElement
		const runDigitInput = screen.getByPlaceholderText('K') as HTMLInputElement
		const nombreInput = screen.getByLabelText('Nombre') as HTMLInputElement
		const apellidosInput = screen.getByLabelText('Apellidos') as HTMLInputElement
		const correoInput = screen.getByLabelText('Correo electrónico') as HTMLInputElement
		const birthdateInput = screen.getByLabelText(/Fecha de nacimiento/i) as HTMLInputElement
		const direccionInput = screen.getByLabelText('Dirección') as HTMLInputElement
		const regionSelect = (await screen.findByLabelText('Región')) as HTMLSelectElement
		const comunaSelect = screen.getByLabelText('Comuna') as HTMLSelectElement
		const codigoInput = screen.getByLabelText('Código promocional (opcional)') as HTMLInputElement
		const passwordInput = screen.getByLabelText('Contraseña', { selector: 'input' }) as HTMLInputElement
		const confirmPasswordInput = screen.getByLabelText('Confirmar contraseña', { selector: 'input' }) as HTMLInputElement
		const termsCheckbox = screen.getByLabelText(/Acepto los/i) as HTMLInputElement
		const heading = screen.getByRole('heading', { name: /Crear cuenta/i })

		await user.type(runBodyInput, '19011022')
		await user.type(runDigitInput, 'K')
		await user.type(nombreInput, 'María Luisa')
		await user.type(apellidosInput, 'Pérez González')
		await user.type(correoInput, 'maria@duoc.cl')
		await user.type(birthdateInput, '1995-05-10')
		await user.type(direccionInput, 'Av. Pastel 123')
		await user.selectOptions(regionSelect, '13')
		await user.selectOptions(comunaSelect, 'Santiago')
		await user.type(codigoInput, 'felices50')
		await user.type(passwordInput, 'dulce123')
		await user.type(confirmPasswordInput, 'dulce123')
		await user.click(termsCheckbox)

		const snapshot = {
			heading: heading.textContent?.replace(/\s+/g, ' ').trim(),
			run: {
				body: runBodyInput.value,
				digit: runDigitInput.value,
			},
			nombre: nombreInput.value,
			apellidos: apellidosInput.value,
			correo: correoInput.value,
			fechaNacimiento: birthdateInput.value,
			direccion: direccionInput.value,
			region: regionSelect.value,
			comuna: comunaSelect.value,
			codigoPromocional: codigoInput.value,
			password: passwordInput.value,
			confirmPassword: confirmPasswordInput.value,
			termsAccepted: termsCheckbox.checked,
		}

		expect(snapshot).toMatchInlineSnapshot(`
		  {
		    "apellidos": "Pérez González",
		    "codigoPromocional": "FELICES50",
		    "comuna": "Santiago",
		    "confirmPassword": "dulce123",
		    "correo": "maria@duoc.cl",
		    "direccion": "Av. Pastel 123",
		    "fechaNacimiento": "1995-05-10",
		    "heading": "Crear cuenta",
		    "nombre": "María Luisa",
		    "password": "dulce123",
		    "region": "13",
		    "run": {
		      "body": "19011022",
		      "digit": "K",
		    },
		    "termsAccepted": true,
		  }
		`)
	})
})
