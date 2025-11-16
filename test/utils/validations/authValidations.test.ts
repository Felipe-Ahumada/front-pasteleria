import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { StoredUser } from '@/types/user'
import { LOCAL_STORAGE_KEYS } from '@/utils/storage/initLocalData'
import { errorMessages } from '@/utils/validations/errorMessages'

vi.mock('@/utils/storage/localStorageUtils', () => ({
	getLocalData: vi.fn(),
}))

import { getLocalData } from '@/utils/storage/localStorageUtils'
import { validateLoginForm } from '@/utils/validations/authValidations'

const mockedGetLocalData = vi.mocked(getLocalData)

describe('validateLoginForm', () => {
	const baseValues = {
		email: 'Usuario@Duoc.cl',
		password: 'Clave12',
	}

	beforeEach(() => {
		mockedGetLocalData.mockReset()
	})

	it('requires an existing email when the option is enabled', () => {
		mockedGetLocalData.mockReturnValue([])

		const missingEmailResult = validateLoginForm(baseValues, { requireExistingEmail: true })

		expect(mockedGetLocalData).toHaveBeenCalledWith(LOCAL_STORAGE_KEYS.usuarios)
		expect(missingEmailResult.isValid).toBe(false)
		expect(missingEmailResult.errors.email).toBe(errorMessages.userNotFound)

		const storedUser: StoredUser = {
			id: '1',
			run: '11111111-1',
			nombre: 'Usuario',
			apellidos: 'Prueba',
			correo: 'usuario@duoc.cl',
			tipoUsuario: 'Cliente',
			regionId: '13',
			regionNombre: 'Metropolitana',
			comuna: 'Santiago',
			direccion: 'Calle Falsa 123',
			password: 'hash',
		}

		mockedGetLocalData.mockReturnValue([storedUser])

		const validResult = validateLoginForm(baseValues, { requireExistingEmail: true })

		expect(mockedGetLocalData).toHaveBeenCalledTimes(2)
		expect(validResult.isValid).toBe(true)
		expect(validResult.errors).toEqual({})
	})
})
