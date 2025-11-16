import { describe, expect, it, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ContactPage from '@/pages/contact/ContactPage'

const appendLocalDataMock = vi.hoisted(() => vi.fn())

vi.mock('@/utils/storage/localStorageUtils', () => ({
	appendLocalData: appendLocalDataMock,
}))

const renderContactPage = () => render(<ContactPage />)

describe('ContactPage snapshots', () => {
	beforeEach(() => {
		appendLocalDataMock.mockReset()
	})

	it('shows the success feedback after sending a valid message', async () => {
		renderContactPage()
		const user = userEvent.setup()

		const nombreInput = screen.getByLabelText('Nombre completo') as HTMLInputElement
		const correoInput = screen.getByLabelText('Correo electrónico') as HTMLInputElement
		const comentarioInput = screen.getByLabelText('Comentario') as HTMLTextAreaElement
		const submitButton = screen.getByRole('button', { name: /Enviar/i })

		await user.type(nombreInput, 'Carla Dulce')
		await user.type(correoInput, 'carla@duoc.cl')
		await user.type(comentarioInput, 'Quisiera solicitar una docena de cupcakes personalizados.')
		await user.click(submitButton)

		const alert = await screen.findByRole('alert')

		const snapshot = {
			feedback: alert.textContent?.trim(),
			values: {
				nombre: nombreInput.value,
				correo: correoInput.value,
				comentario: comentarioInput.value,
			},
			appendLocalDataCalls: appendLocalDataMock.mock.calls.length,
		}

		expect(snapshot).toMatchInlineSnapshot(`
		  {
		    "appendLocalDataCalls": 1,
		    "feedback": "¡Mensaje enviado! Te contactaremos a la brevedad.",
		    "values": {
		      "comentario": "",
		      "correo": "",
		      "nombre": "",
		    },
		  }
		`)
	})
})
