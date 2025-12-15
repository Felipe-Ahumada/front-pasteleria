import { useCallback, useEffect, useState } from 'react'
import type { ChangeEvent, FocusEvent, FormEvent, MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button, Input } from '@/components/common'
import { logoImage } from "@/assets";

import type { ValidationErrors } from '@/utils/validations/types'
import {
	validateResetPasswordForm,
	type ResetPasswordFormValues,
} from '@/utils/validations/userValidations'
import { userService } from '@/service/userService'

const HERO_IMAGE =
  "https://res.cloudinary.com/dx83p4455/image/upload/v1762263516/diversidad_pasteles_ttxbx1.jpg";

const createInitialValues = (): ResetPasswordFormValues => ({
	email: '',
	password: '',
	confirmPassword: '',
})

const ResetPasswordPage = () => {
    const navigate = useNavigate();
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [values, setValues] = useState<ResetPasswordFormValues>(createInitialValues())
	const [errors, setErrors] = useState<ValidationErrors<ResetPasswordFormValues>>({})
	const [touched, setTouched] = useState<Partial<Record<keyof ResetPasswordFormValues, boolean>>>({})
	const [formMessage, setFormMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null)
	const [loading, setLoading] = useState(false)

    // Ensure any open offcanvas is cleaned up when entering this standalone page
    useEffect(() => {
        document.querySelectorAll(".offcanvas.show").forEach((element) => {
            if (element instanceof HTMLElement) {
                element.classList.remove("show");
                element.style.removeProperty("visibility");
                element.setAttribute("aria-hidden", "true");
            }
        });
        document.querySelectorAll(".offcanvas-backdrop").forEach((backdrop) => backdrop.remove());
        document.body.style.removeProperty("overflow");
        document.body.removeAttribute("data-bs-overflow");
        document.body.removeAttribute("data-bs-padding-right");
    }, []);

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
			await userService.resetPassword(values.email, values.password);

			setValues(createInitialValues())
			setErrors({})
			setTouched({})
			setShowNewPassword(false)
			setShowConfirmPassword(false)
			setFormMessage({
				type: 'success',
				text: 'Contraseña actualizada con éxito. Redirigiendo al inicio...',
			})
			setTimeout(() => {
				window.location.href = '/'
			}, 2000)
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
		<main className="mt-0">
		  <section
			className="position-relative overflow-hidden text-white"
			style={{
			  backgroundImage: `linear-gradient(135deg, rgba(39, 12, 63, 0.75), rgba(233, 30, 99, 0.55)), url(${HERO_IMAGE})`,
			  backgroundSize: "cover",
			  backgroundPosition: "center",
			  backgroundRepeat: "no-repeat",
			}}
		  >
			<div className="container py-3 position-relative">
			  <div className="row justify-content-center">
				<div className="col-11 col-md-10 col-lg-6">
				  <div
					className="d-flex flex-column flex-lg-row align-items-center gap-3 text-center text-lg-start p-3 p-lg-4 rounded-4 shadow-lg"
					style={{
					  background: "rgba(31, 8, 56, 0.5)",
					  backdropFilter: "blur(18px)",
					  border: "1px solid rgba(255, 255, 255, 0.2)",
					}}
				  >
					<img
					  src={logoImage}
					  alt="Pastelería Mil Sabores"
					  width={140}
					  className="rounded-pill shadow border border-light border-opacity-50"
					/>
					<div>
					  <h1 className="mb-2 brand-name text-white">
						Pastelería Mil Sabores
					  </h1>
					  <h2
						className="h4 mb-3"
						style={{ color: "rgba(255, 255, 255, 0.85)" }}
					  >
						Recuperar Contraseña
					  </h2>
					  <p
						className="lead mb-0"
						style={{ color: "rgba(255, 255, 255, 0.9)" }}
					  >
						Restablece tu acceso y vuelve a disfrutar de nuestros dulces.
					  </p>
					</div>
				  </div>
				</div>
			  </div>
			</div>
		  </section>
	
		  <section className="py-5">
			<div className="container">
			  <div className="row justify-content-center">
				<div className="col-12 col-lg-8 col-xl-6">
				  <div className="bg-body border rounded-3 shadow-sm p-4 p-lg-5">
					<header className="d-flex align-items-start justify-content-between mb-4">
					  <div>
						<h2 className="h4 mb-0">
						  <i
							className="bi bi-shield-lock me-2"
							aria-hidden="true"
						  />
						  Restablecer contraseña
						</h2>
                        <p className="mb-0 text-muted mt-2">
                         Ingresa tu correo y define tu nueva contraseña.
                        </p>
					  </div>
					  <Button
						type="button"
						size="sm"
						variant="mint"
						aria-label="Volver al inicio"
						onClick={() => {
							window.location.href = '/'
						}}
					  >
						<i className="bi bi-x-lg" aria-hidden="true" />
					  </Button>
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
                            ¿Recuerdas tu contraseña?{' '}
                            <button
                                type="button"
                                className="btn btn-link link-body-emphasis p-0 align-baseline border-0 bg-transparent"
                                onClick={() => {
                                    window.location.href = '/'
                                }}
                                style={{ textDecoration: 'underline', fontSize: 'inherit' }}
                            >
                                Volver al inicio
                            </button>
                        </p>
					</form>
				  </div>
				</div>
			  </div>
			</div>
		  </section>
		</main>
	)
}

export default ResetPasswordPage
