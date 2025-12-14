import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { Button, Input } from "@/components/common";
import { contactMessageService } from "@/service/contactMessageService";
import {
	validateContactForm,
	type ContactFormValues,
} from "@/utils/validations/contactValidations";
import { sanitizeNameField } from "@/utils/validations/userValidations";
import type { ValidationErrors } from "@/utils/validations/types";
import type { ContactMessage } from "@/types/contactMessage";

const createMessageId = () => {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return crypto.randomUUID();
	}

	return `contact-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const CONTACT_HERO_IMAGE =
  "https://res.cloudinary.com/dx83p4455/image/upload/v1762263516/diversidad_pasteles_ttxbx1.jpg";

const ContactPage = () => {
  const [values, setValues] = useState<ContactFormValues>({
    nombre: "",
    correo: "",
    comentario: "",
  });
  const [errors, setErrors] = useState<ValidationErrors<ContactFormValues>>({});
  const [feedback, setFeedback] = useState<{
    type: "success" | "danger";
    text: string;
  } | null>(null);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    const sanitizedValue = name === "nombre" ? sanitizeNameField(value) : value;
    setValues((previous) => ({ ...previous, [name]: sanitizedValue }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
    setFeedback(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateContactForm(values);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setFeedback({
        type: "danger",
        text: "Revisa los campos marcados e inténtalo nuevamente.",
      });
      return;
    }

    const message: ContactMessage = {
      id: createMessageId(),
      nombre: values.nombre,
      correo: values.correo,
      comentario: values.comentario,
      fecha: new Date().toISOString(),
      leido: false,
    };

    contactMessageService.add(message);
    setFeedback({
      type: "success",
      text: "¡Mensaje enviado! Te contactaremos a la brevedad.",
    });
    setValues({ nombre: "", correo: "", comentario: "" });
  };

  return (
    <main className="p-0">
      {/* Hero Section */}
      <div
        className="about-hero"
        style={{ backgroundImage: `url(${CONTACT_HERO_IMAGE})` }}
      >
        <div className="about-hero-content">
          <h1 className="about-hero-title">CONTACTO</h1>
        </div>

        <div className="about-sidebar-decoration">
          <a
            href="https://www.instagram.com/pasteleria1000sabores"
            target="_blank"
            rel="noreferrer"
            className="about-sidebar-link"
          >
            <i className="bi bi-instagram"></i>
            <span>Síguenos</span>
          </a>
          <div className="about-sidebar-line"></div>
        </div>
      </div>

      <section className="bg-cocoa-dark py-5">
        <div className="container">
          <div
            className="row justify-content-center"
            style={{ animation: "fadeInUp 0.8s ease-out" }}
          >
            {/* Info Column (Hidden on mobile, visible on lg) */}
            <div className="col-lg-5 d-none d-lg-block mb-4">
              <div className="bg-cocoa-glass h-100 rounded-4 p-5 d-flex flex-column justify-content-center text-center border-gold shadow-lg">
                <i className="bi bi-envelope-paper display-1 text-gold mb-4"></i>
                <h3 className="text-gold mb-3">¡Escríbenos!</h3>
                <p className="text-premium-body fs-5 lead">
                  ¿Tienes una idea dulce en mente o una consulta sobre nuestros
                  productos?
                </p>
                <p className="text-premium-body mt-2">
                  Déjanos tu mensaje y nos pondremos en contacto contigo a la
                  brevedad.
                </p>
              </div>
            </div>

            {/* Form Column */}
            <div className="col-12 col-lg-6">
              <div className="card bg-cocoa-glass border-gold shadow-lg p-4 p-md-5 rounded-4">
                <h2 className="text-center mb-4 text-uppercase text-gold h3">
                  Formulario
                </h2>
                <form noValidate onSubmit={handleSubmit}>
                  {feedback ? (
                    <div
                      className={`alert alert-${feedback.type} border-${
                        feedback.type === "success" ? "success" : "danger"
                      }`}
                      role="alert"
                    >
                      {feedback.text}
                    </div>
                  ) : null}

                  <div className="mb-3">
                    <label className="form-label fw-bold text-gold">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      className={`form-control bg-cocoa-input ${
                        errors.nombre ? "is-invalid" : ""
                      }`}
                      placeholder="Ej: Juan Pérez"
                      value={values.nombre}
                      onChange={handleInputChange}
                    />
                    {errors.nombre && (
                      <div className="invalid-feedback">{errors.nombre}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-gold">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      name="correo"
                      className={`form-control bg-cocoa-input ${
                        errors.correo ? "is-invalid" : ""
                      }`}
                      placeholder="ejemplo@correo.com"
                      value={values.correo}
                      onChange={handleInputChange}
                    />
                    <div className="form-text text-white-50 small">
                      Dominios permitidos: @duoc.cl, @profesor.duoc.cl,
                      @gmail.com
                    </div>
                    {errors.correo && (
                      <div className="invalid-feedback">{errors.correo}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      className="form-label fw-bold text-gold"
                      htmlFor="contactComment"
                    >
                      Comentario
                    </label>
                    <textarea
                      className={`form-control bg-cocoa-input ${
                        errors.comentario ? " is-invalid" : ""
                      }`}
                      id="contactComment"
                      name="comentario"
                      rows={4}
                      placeholder="Escribe tu mensaje aquí (máximo 500 caracteres)..."
                      value={values.comentario}
                      onChange={handleInputChange}
                    />
                    {errors.comentario && (
                      <div className="invalid-feedback">
                        {errors.comentario}
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    block
                    variant="mint"
                    className="fw-bold py-3 shadow-soft"
                  >
                    <i className="bi bi-send me-2"></i>
                    Enviar Mensaje
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
