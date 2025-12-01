import { useCallback, useState } from 'react'
import type { ChangeEvent, FocusEvent, FormEvent, MouseEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Button, Input } from '@/components/common'

import type { ValidationErrors } from '@/utils/validations/types'
import {
	validateResetPasswordForm,
	type ResetPasswordFormValues,
} from '@/utils/validations/userValidations'
import { userService } from '@/service/userService'

const createInitialValues = (): ResetPasswordFormValues => ({
	email: '',
	password: '',
	confirmPassword: '',
})

const ResetPasswordPage = () => {
	const location = useLocation()
	const currentPath = `${location.pathname}${location.search}`
	const navigate = useNavigate()
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [values, setValues] = useState<ResetPasswordFormValues>(createInitialValues())
	const [errors, setErrors] = useState<ValidationErrors<ResetPasswordFormValues>>({})
	const [touched, setTouched] = useState<Partial<Record<keyof ResetPasswordFormValues, boolean>>>({})
	const [formMessage, setFormMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null)
	const [loading, setLoading] = useState(false)

	const handleOpenLogin = useCallback(
		(event: MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault()
			navigate(`${location.pathname}${location.search}`, {
				replace: true,
				state: { from: currentPath, openLogin: true },
			})
		},
		[currentPath, location.pathname, location.search, navigate],
	)

	const runValidation = useCallback(
		(nextValues: ResetPasswordFormValues, nextTouched: Partial<Record<keyof ResetPasswordFormValues, boolean>>) => {
			const validation = validateResetPasswordForm(nextValues)
			const filtered: ValidationErrors<ResetPasswordFormValues> = {}
			;(Object.keys(nextTouched) as Array<keyof ResetPasswordFormValues>).forEach((key) => {
				if (!nextTouched[key]) {
					return
				}
				const message = validation.errors[key]
				if (message) {
					filtered[key] = message
				}
			})
			setErrors(filtered)
			return validation
		},
		[setErrors],
	)

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.currentTarget
		const field = name as keyof ResetPasswordFormValues
		const nextValues = { ...values, [field]: value }
		const nextTouched: Partial<Record<keyof ResetPasswordFormValues, boolean>> = {
			...touched,
			[field]: true,
		}
		runValidation(nextValues, nextTouched)
		setValues(nextValues)
		setTouched(nextTouched)
		setFormMessage(null)
	}

	const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
		const { name } = event.currentTarget
		if (!name) {
			return
		}
		const field = name as keyof ResetPasswordFormValues
		const nextTouched = { ...touched, [field]: true }
		runValidation(values, nextTouched)
		setTouched(nextTouched)
	}

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const allTouched: Partial<Record<keyof ResetPasswordFormValues, boolean>> = {
			email: true,
			password: true,
			confirmPassword: true,
		}
		const validation = runValidation(values, allTouched)
		setTouched(allTouched)
		if (!validation.isValid) {
			setFormMessage({ type: 'danger', text: 'Corrige los campos marcados antes de continuar.' })
			return
		}

		setLoading(true)
		try {
			// Call backend to reset password
			// Note: We send the plain password because the backend handles hashing.
			// However, if we want to be consistent with registration (where we sent plain password),
			// we should send plain password here too.
			// The backend resetPassword method encodes it.
			await userService.resetPassword(values.email, values.password);

			setValues(createInitialValues())
			setErrors({})
			setTouched({})
			setShowNewPassword(false)
			setShowConfirmPassword(false)
			setFormMessage({
				type: 'success',
				text: 'Contraseña actualizada con éxito. Ya puedes iniciar sesión con tu nueva contraseña.',
			})
		} catch (error: any) {
			console.error("Error resetting password:", error);
			const errorMessage =
				error.response?.data && typeof error.response.data === "string"
					? error.response.data
					: "Error al restablecer la contraseña. Verifica que el correo sea correcto.";
			setFormMessage({
				type: 'danger',
				text: errorMessage,
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<main className="container py-5">
			<div className="row justify-content-center">
				<div className="col-12 col-md-10 col-lg-6">
					<div className="card shadow-soft p-4">
						<header className="text-center mb-4">
							<h1 className="h4 mb-2">Restablecer contraseña</h1>
							<p className="mb-0">Ingresa tu correo y define tu nueva contraseña.</p>
						</header>

						<form onSubmit={handleSubmit} noValidate>
							{formMessage ? (
								<div className={`alert alert-${formMessage.type}`} role="alert">
									{formMessage.text}
								</div>
							) : null}
							<Input
								type="email"
								name="email"
								id="resetEmail"
								label="Correo electrónico"
								placeholder="tucorreo@dominio.com"
								value={values.email}
								onChange={handleChange}
								onBlur={handleBlur}
								errorText={errors.email}
							/>

							<div className="mb-3">
								<label className="form-label fw-semibold" htmlFor="newPassword">
									Nueva contraseña
								</label>
								<div className="input-group">
									<input
										type={showNewPassword ? 'text' : 'password'}
										className={`form-control${errors.password ? ' is-invalid' : ''}`}
										id="newPassword"
										name="password"
										value={values.password}
										onChange={handleChange}
										onBlur={handleBlur}
										aria-describedby="newPasswordHelp"
									/>
									<button
										type="button"
										className="btn btn-pastel btn-mint"
										onClick={() => setShowNewPassword((value) => !value)}
										aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
									>
										<i className={showNewPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} aria-hidden="true" />
									</button>
								</div>
								<div id="newPasswordHelp" className="form-text">
									Debe tener entre 4 y 10 caracteres.
								</div>
								{errors.password ? (
									<div className="invalid-feedback d-block">{errors.password}</div>
								) : null}
							</div>

							<div className="mb-4">
								<label className="form-label fw-semibold" htmlFor="confirmPassword">
									Confirmar contraseña
								</label>
								<div className="input-group">
									<input
										type={showConfirmPassword ? 'text' : 'password'}
										className={`form-control${errors.confirmPassword ? ' is-invalid' : ''}`}
										id="confirmPassword"
										name="confirmPassword"
										value={values.confirmPassword}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									<button
										type="button"
										className="btn btn-pastel btn-mint"
										onClick={() => setShowConfirmPassword((value) => !value)}
										aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'}
									>
										<i className={showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} aria-hidden="true" />
									</button>
								</div>
								{errors.confirmPassword ? (
									<div className="invalid-feedback d-block">{errors.confirmPassword}</div>
								) : null}
							</div>

							<Button type="submit" block variant="strawberry" disabled={loading}>
								{loading ? 'Actualizando...' : 'Restablecer contraseña'}
							</Button>

							<p className="text-center mt-4 mb-0">
								<small>
									¿Recuerdas tu contraseña?{' '}
									<Link to="/login" className="link-body-emphasis" onClick={handleOpenLogin}>
										Volver al inicio de sesión
									</Link>
								</small>
							</p>
						</form>
					</div>
				</div>
			</div>
		</main>
	)
}

export default ResetPasswordPage
