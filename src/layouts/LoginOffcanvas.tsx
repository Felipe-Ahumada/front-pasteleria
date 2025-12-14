import { useCallback, useState } from "react";
import type { ChangeEvent, FocusEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

import { Button, Input } from "@/components/common";
import { hideOffcanvas } from "@/utils/offcanvas";
import useAuth from "@/hooks/useAuth";
import { validateLoginForm } from "@/utils/validations/authValidations";
import type { LoginFormValues } from "@/utils/validations/authValidations";
import type { ValidationErrors } from "@/utils/validations/types";

const LoginOffcanvas = () => {
  const { login, loading } = useAuth();
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors<LoginFormValues>>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof LoginFormValues, boolean>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);

  const handleNavigate = useCallback(() => {
    hideOffcanvas("offcanvasLogin");
  }, []);

  const runValidation = useCallback(
    (
      nextValues: LoginFormValues,
      nextTouched: Partial<Record<keyof LoginFormValues, boolean>>
    ) => {
      const validation = validateLoginForm(nextValues);
      const filtered: ValidationErrors<LoginFormValues> = {};
      (Object.keys(nextTouched) as Array<keyof LoginFormValues>).forEach(
        (key) => {
          if (!nextTouched[key]) {
            return;
          }
          const message = validation.errors[key];
          if (message) {
            filtered[key] = message;
          }
        }
      );
      setErrors(filtered);
      return validation;
    },
    [setErrors]
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    const field = name as keyof LoginFormValues;
    const nextValues = { ...values, [field]: value };
    const nextTouched: Partial<Record<keyof LoginFormValues, boolean>> = {
      ...touched,
      [field]: true,
    };
    runValidation(nextValues, nextTouched);
    setValues(nextValues);
    setTouched(nextTouched);
    setFormError(null);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const { name } = event.currentTarget;
    if (!name) {
      return;
    }
    const field = name as keyof LoginFormValues;
    const nextTouched = { ...touched, [field]: true };
    runValidation(values, nextTouched);
    setTouched(nextTouched);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const allTouched: Partial<Record<keyof LoginFormValues, boolean>> = {
      email: true,
      password: true,
    };
    const validation = runValidation(values, allTouched);
    setTouched(allTouched);
    if (!validation.isValid) {
      return;
    }

    try {
      await login(values);
      hideOffcanvas("offcanvasLogin");
      setValues({ email: "", password: "" });
      setErrors({});
      setTouched({});
      setFormError(null);
    } catch (error: any) {
      if (error.response?.status === 401 || error.message?.includes("401")) {
        setFormError("Usuario o contraseña incorrectos");
      } else if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("No fue posible iniciar sesión. Inténtalo nuevamente.");
      }
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end login-panel"
      tabIndex={-1}
      id="offcanvasLogin"
      aria-labelledby="offcanvasLoginLabel"
      data-bs-backdrop="true"
      data-bs-scroll="false"
    >
      <div className="offcanvas-header navbar-theme py-3" style={{ borderBottom: '4px solid var(--title-tertiary)' }}>
        <h5 
          className="offcanvas-title" 
          id="offcanvasLoginLabel"
          style={{ 
            color: 'var(--title-tertiary)', 
            fontFamily: '"Montserrat", sans-serif', 
            fontSize: '1.8rem',
            fontWeight: 700,
            letterSpacing: '1px',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)' 
          }}
        >
          <i className="bi bi-person me-2" aria-hidden /> Iniciar sesión
        </h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Cerrar"
        />
      </div>

      <div 
        className="offcanvas-body" 
        style={{ 
          backgroundColor: '#4A342E',
          color: '#fff'
        }}
      >
        <style>
          {`
            .custom-login-input {
              background-color: rgba(255, 255, 255, 0.1) !important;
              border: 1px solid rgba(255, 255, 255, 0.2) !important;
              color: #fff !important;
            }
            .custom-login-input:focus {
              background-color: rgba(255, 255, 255, 0.15) !important;
              border-color: var(--title-tertiary) !important;
              box-shadow: 0 0 0 0.25rem rgba(196, 163, 90, 0.25) !important;
            }
            .custom-login-input::placeholder {
              color: rgba(255, 255, 255, 0.5) !important;
            }
            .custom-login-label {
              font-weight: 500;
              color: var(--title-tertiary);
              font-size: 0.95rem;
              letter-spacing: 0.5px;
            }
            .form-check-input {
              background-color: rgba(255, 255, 255, 0.1);
              border-color: rgba(255, 255, 255, 0.3);
            }
            .form-check-input:checked {
              background-color: var(--title-tertiary);
              border-color: var(--title-tertiary);
            }
          `}
        </style>
        <form onSubmit={handleSubmit} noValidate>
          {formError ? (
            <div className="alert alert-danger" role="alert">
              {formError}
            </div>
          ) : null}
          
          <div className="mb-3">
             <label htmlFor="loginEmail" className="form-label custom-login-label">Correo electrónico</label>
             <Input
                type="email"
                id="loginEmail"
                name="email"
                placeholder="tucorreo@dominio.com"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                errorText={errors.email}
                className="form-control custom-login-input"
                style={{ borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}
                containerClassName="m-0"
             />
          </div>

          <div className="mb-3">
             <label htmlFor="loginPassword" className="form-label custom-login-label">Contraseña</label>
             <Input
                type="password"
                id="loginPassword"
                name="password"
                placeholder="••••"
                value={values.password}
                onChange={handleChange}
                autoComplete="current-password"
                onBlur={handleBlur}
                errorText={errors.password}
                className="form-control custom-login-input"
                style={{ borderRadius: 'var(--radius)', padding: '0.75rem 1rem' }}
                containerClassName="m-0"
             />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="rememberMe"
                style={{ cursor: 'pointer' }}
              />
              <label className="form-check-label" htmlFor="rememberMe" style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>
                Recordarme
              </label>
            </div>
            <Link
              to="/reset-password"
              className="link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
              onClick={handleNavigate}
              style={{ color: 'var(--pastel-strawberry)', fontWeight: 500, fontSize: '0.9rem' }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button
            type="submit"
            block
            className="mb-2 shadow-sm"
            variant="strawberry"
            disabled={loading}
            style={{ fontWeight: 700, letterSpacing: '0.5px', borderRadius: '99px', padding: '0.75rem' }}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>

          <hr className="my-4" style={{ borderColor: 'var(--title-tertiary)', opacity: 0.3 }} />

          <p className="mb-0 text-center" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)' }}>
            ¿No tienes cuenta?
            <Link
              to="/register"
              className="ms-1 fw-bold"
              style={{ color: 'var(--title-tertiary)', textDecoration: 'none' }}
              onClick={handleNavigate}
            >
              Crear cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginOffcanvas;
