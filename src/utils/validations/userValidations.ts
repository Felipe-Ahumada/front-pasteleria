import { defaultProfileImage } from "@/assets";
import { normalizeAvatarUrl } from "@/utils/storage/avatarUrl";
import type { StoredUser, UserRoleName } from "@/types/user";
import { ensureHashedPassword } from "@/utils/security/password";
import type { Region } from "@/service/locationService";

import { ALLOWED_EMAIL_DOMAINS } from "./authValidations";
import { errorMessages } from "./errorMessages";
import type { ValidationResult } from "./types";

export const MIN_AGE = 18;

export type UserFormValues = {
  id?: string;
  run: string;
  runBody: string;
  runDigit: string;
  nombre: string;
  apellidos: string;
  correo: string;
  fechaNacimiento?: string;
  regionId: string;
  comuna: string;
  direccion: string;
  password: string;
  confirmPassword?: string;
  termsAccepted?: boolean;
  avatarUrl?: string;
  codigoDescuento?: string;
  tipoUsuario?: UserRoleName;
  activo?: boolean;
};

export type ResetPasswordFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type UserValidationOptions = {
  mode: "create" | "update";
  regions?: Region[];
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[\p{L}\s´¨]+$/u;
const NAME_SANITIZE_REGEX = /[^\p{L}\s´¨]/gu;
export const sanitizeNameField = (value: string): string =>
  value.replace(NAME_SANITIZE_REGEX, "");

const RUN_BODY_REGEX = /^[0-9]{7,8}$/;
const RUN_DIGIT_REGEX = /^[0-9K]$/i;

const sanitizeRun = (value: string) =>
  value.replace(/[^0-9kK]/g, "").toUpperCase();

const calculateRunVerifier = (runNumbers: string): string => {
  let sum = 0;
  let multiplier = 2;

  for (let index = runNumbers.length - 1; index >= 0; index -= 1) {
    sum += Number(runNumbers[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  if (remainder === 11) {
    return "0";
  }
  if (remainder === 10) {
    return "K";
  }
  return String(remainder);
};

const isValidRun = (run: string): boolean => {
  const normalized = sanitizeRun(run);
  if (!/^[0-9]{7,8}[0-9K]$/.test(normalized)) {
    return false;
  }

  const body = normalized.slice(0, -1);
  const verifier = normalized.slice(-1);
  return calculateRunVerifier(body) === verifier;
};

export const validateAge = (
  value: string | undefined,
  minAge = MIN_AGE
): boolean => {
  if (!value) {
    return true;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - parsed.getFullYear();
  const monthDiff = today.getMonth() - parsed.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < parsed.getDate())
  ) {
    age -= 1;
  }

  return age >= minAge;
};

export const validateUserForm = (
  values: UserFormValues,
  options: UserValidationOptions
): ValidationResult<UserFormValues> => {
  const errors: ValidationResult<UserFormValues>["errors"] = {};

  const runBody = values.runBody?.trim() ?? "";
  const runDigit = values.runDigit?.trim().toUpperCase() ?? "";
  const run = runBody && runDigit ? `${runBody}${runDigit}` : "";
  const nombre = values.nombre?.trim() ?? "";
  const apellidos = values.apellidos?.trim() ?? "";
  const correo = values.correo?.trim() ?? "";
  const direccion = values.direccion?.trim() ?? "";
  const regionId = values.regionId?.trim() ?? "";
  const comuna = values.comuna?.trim() ?? "";
  const password = values.password?.trim() ?? "";
  const confirmPassword = values.confirmPassword?.trim() ?? "";
  const termsAccepted = Boolean(values.termsAccepted);

  if (!runBody) {
    errors.runBody = "Ingresa los 7 u 8 dígitos del RUN";
  } else if (!RUN_BODY_REGEX.test(runBody)) {
    errors.runBody = "El RUN debe contener 7 u 8 dígitos numéricos";
  } else if (runBody.startsWith("0")) {
    errors.runBody = errorMessages.runLeadingZero;
  }

  if (!runDigit) {
    errors.runDigit = "Ingresa el dígito verificador";
  } else if (!RUN_DIGIT_REGEX.test(runDigit)) {
    errors.runDigit = "El dígito verificador debe ser un número o K";
  }

  if (!errors.runBody && !errors.runDigit) {
    if (!run) {
      errors.run = errorMessages.required("El RUN completo");
    } else if (!isValidRun(run)) {
      errors.run = errorMessages.runFormat;
    }
    // Uniqueness check removed: handled by backend
  }

  if (!nombre) {
    errors.nombre = errorMessages.required("El nombre");
  } else if (!NAME_REGEX.test(nombre)) {
    errors.nombre = errorMessages.lettersOnly("El nombre");
  } else if (nombre.length > 50) {
    errors.nombre = errorMessages.maxLength("El nombre", 50);
  }

  if (!apellidos) {
    errors.apellidos = errorMessages.required("Los apellidos");
  } else if (!NAME_REGEX.test(apellidos)) {
    errors.apellidos = errorMessages.lettersOnly("Los apellidos");
  } else if (apellidos.length > 100) {
    errors.apellidos = errorMessages.maxLength("Los apellidos", 100);
  }

  if (!correo) {
    errors.correo = errorMessages.required("El correo");
  } else if (correo.length > 100) {
    errors.correo = errorMessages.maxLength("El correo", 100);
  } else if (!EMAIL_REGEX.test(correo)) {
    errors.correo = errorMessages.emailFormat;
  } else {
    const correoDomain = correo.toLowerCase().split("@")[1] ?? "";
    const isAllowedDomain = ALLOWED_EMAIL_DOMAINS.some(
      (allowed) => allowed === correoDomain
    );
    if (!isAllowedDomain) {
      errors.correo = errorMessages.emailDomain([...ALLOWED_EMAIL_DOMAINS]);
    }
    // Uniqueness check removed: handled by backend
  }

  if (values.fechaNacimiento) {
    if (!validateAge(values.fechaNacimiento)) {
      errors.fechaNacimiento = errorMessages.ageRestriction(MIN_AGE);
    }
  }

  if (!regionId) {
    errors.regionId = errorMessages.selectionRequired("región");
  } else if (options.regions) {
    const regionExists = options.regions.find((r) => r.codigo === regionId);
    if (!regionExists) {
      errors.regionId = "La región seleccionada no es válida";
    }
  }

  if (!comuna) {
    errors.comuna = errorMessages.selectionRequired("comuna");
  }

  if (!direccion) {
    errors.direccion = errorMessages.required("La dirección");
  } else if (direccion.length > 300) {
    errors.direccion = errorMessages.maxLength("La dirección", 300);
  }

  if (options.mode === "create") {
    if (!password) {
      errors.password = errorMessages.required("La contraseña");
    } else if (password.length < 4 || password.length > 50) {
      errors.password = "La contraseña debe tener entre 4 y 50 caracteres";
    }

    if (!confirmPassword) {
      errors.confirmPassword = errorMessages.required(
        "La confirmación de contraseña"
      );
    } else if (password && password !== confirmPassword) {
      errors.confirmPassword = errorMessages.passwordMismatch;
    }

    if (!termsAccepted) {
      errors.termsAccepted = errorMessages.acceptTerms;
    }
  } else {
    if (password) {
      if (password.length < 4 || password.length > 10) {
        errors.password = "La contraseña debe tener entre 4 y 10 caracteres";
      }
      if (confirmPassword && password !== confirmPassword) {
        errors.confirmPassword = errorMessages.passwordMismatch;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateResetPasswordForm = (
  values: ResetPasswordFormValues
): ValidationResult<ResetPasswordFormValues> => {
  const errors: ValidationResult<ResetPasswordFormValues>["errors"] = {};

  const email = values.email?.trim() ?? "";
  const password = values.password?.trim() ?? "";
  const confirmPassword = values.confirmPassword?.trim() ?? "";

  if (!email) {
    errors.email = errorMessages.required("El correo");
  } else if (email.length > 100) {
    errors.email = errorMessages.maxLength("El correo", 100);
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = errorMessages.emailFormat;
  } else {
    const correoDomain = email.toLowerCase().split("@")[1] ?? "";
    const isAllowedDomain = ALLOWED_EMAIL_DOMAINS.some(
      (allowed) => allowed === correoDomain
    );
    if (!isAllowedDomain) {
      errors.email = errorMessages.emailDomain([...ALLOWED_EMAIL_DOMAINS]);
    }
    // User existence check removed: handled by backend
  }

  if (!password) {
    errors.password = errorMessages.required("La contraseña");
  } else if (password.length < 4 || password.length > 10) {
    errors.password = "La contraseña debe tener entre 4 y 10 caracteres";
  }

  if (!confirmPassword) {
    errors.confirmPassword = errorMessages.required(
      "La confirmación de contraseña"
    );
  } else if (password && password !== confirmPassword) {
    errors.confirmPassword = errorMessages.passwordMismatch;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const ROLE_MAPPING: Record<UserRoleName, string> = {
  SuperAdmin: "ROLE_SUPERADMIN",
  Administrador: "ROLE_ADMIN",
  Vendedor: "ROLE_SELLER",
  Cliente: "ROLE_CUSTOMER",
};

export const mapFormToStoredUser = (
  values: UserFormValues,
  current?: StoredUser | null,
  regions?: Region[]
): StoredUser => {
  const region = regions?.find((r) => r.codigo === values.regionId);
  const timestamp = new Date().toISOString();
  const rawPassword = values.password?.trim() ?? "";
  const existingPassword = current?.password ?? "";
  const resolvedPassword = rawPassword
    ? ensureHashedPassword(rawPassword)
    : ensureHashedPassword(existingPassword);
  
  // Only use existing ID, do not generate one
  const identifier = values.id ?? current?.id;

  const avatar = normalizeAvatarUrl(
    values.avatarUrl ?? current?.avatarUrl,
    defaultProfileImage
  );
  let role: UserRoleName =
    current?.tipoUsuario ?? values.tipoUsuario ?? "Cliente";

  if (current) {
    if (current.tipoUsuario === "SuperAdmin") {
      role = values.tipoUsuario ?? current.tipoUsuario;
    } else {
      role = current.tipoUsuario;
    }
  } else if (!values.tipoUsuario) {
    role = "Cliente";
  }
  const discountCode =
    values.codigoDescuento?.trim().toUpperCase() || current?.codigoDescuento;
  const isActive = values.activo ?? current?.activo ?? true;

  return {
    id: identifier,
    run: sanitizeRun(`${values.runBody}${values.runDigit}`),
    nombre: values.nombre.trim(),
    apellidos: values.apellidos.trim(),
    correo: values.correo.trim().toLowerCase(),
    fechaNacimiento:
      values.fechaNacimiento || current?.fechaNacimiento || undefined,
    tipoUsuario: ROLE_MAPPING[role] as any,
    regionId: values.regionId,
    regionNombre: region?.nombre ?? values.regionId,
    comuna: values.comuna.trim(),
    direccion: values.direccion.trim(),
    password: resolvedPassword,
    avatarUrl: avatar,
    codigoDescuento: discountCode,
    createdAt: current?.createdAt ?? timestamp,
    updatedAt: timestamp,
    activo: isActive,
  };
};
