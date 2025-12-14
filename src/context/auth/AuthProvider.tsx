import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import AuthContext from "./AuthContext";
import type {
  AuthContextValue,
  AuthCredentials,
  AuthUser,
  UserRole,
} from "./types";
import { authService, type UserResponse } from "@/service/authService";
import type { StoredUser } from "@/types/user";
import { LOCAL_STORAGE_KEYS } from "@/utils/storage/initLocalData";
import {
  getAge,
  isBirthdayToday,
  isDuocStudent,
} from "@/utils/discounts/userDiscounts";

export type { AuthCredentials, AuthUser, UserRole } from "./types";

// Map backend role to frontend role
const mapBackendRole = (backendRole: string): UserRole => {
  switch (backendRole) {
    case "ROLE_SUPERADMIN":
      return "superadmin";
    case "ROLE_ADMIN":
      return "admin";
    case "ROLE_SELLER":
      return "seller";
    case "ROLE_CUSTOMER":
    default:
      return "customer";
  }
};

// Map backend role to StoredUser role
const mapBackendRoleToStoredUser = (
  backendRole: string
): StoredUser["tipoUsuario"] => {
  switch (backendRole) {
    case "ROLE_SUPERADMIN":
      return "SuperAdmin";
    case "ROLE_ADMIN":
      return "Administrador";
    case "ROLE_SELLER":
      return "Vendedor";
    case "ROLE_CUSTOMER":
    default:
      return "Cliente";
  }
};

const extractFirstSegment = (value?: string) => {
  if (!value) {
    return "";
  }

  const [first = ""] = value.trim().split(/\s+/);
  return first;
};

const buildAuthUser = (userResponse: UserResponse): AuthUser => {
  const firstName = extractFirstSegment(userResponse.nombre);
  const lastName = extractFirstSegment(userResponse.apellidos);

  return {
    id: userResponse.id.toString(),
    name: `${userResponse.nombre} ${userResponse.apellidos}`.trim(),
    firstName,
    lastName,
    email: userResponse.correo,
    role: mapBackendRole(userResponse.tipoUsuario),
    discountInfo: {
      isDuocStudent: isDuocStudent(userResponse.correo),
      isBirthday: isBirthdayToday(userResponse.fechaNacimiento),
      age: getAge(userResponse.fechaNacimiento),
      discountCode: userResponse.codigoDescuento,
    },
  };
};

const buildStoredUser = (userResponse: UserResponse): StoredUser => {
  return {
    id: userResponse.id.toString(),
    // Sensitive data excluded from localStorage
    nombre: userResponse.nombre,
    apellidos: userResponse.apellidos,
    tipoUsuario: mapBackendRoleToStoredUser(userResponse.tipoUsuario),
    avatarUrl: userResponse.avatarUrl || "",
    activo: userResponse.activo,
  };
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // On mount, check if there's a token and fetch current user
  useEffect(() => {
    const initializeAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userResponse = await authService.getCurrentUser();
          const authUser = buildAuthUser(userResponse);
          const storedUser = buildStoredUser(userResponse);

          // Save to localStorage for ProfilePage
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.activeUser,
            JSON.stringify(storedUser)
          );

          setUser(authUser);
        } catch (error) {
          console.error("Failed to fetch current user:", error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Listen for storage events to sync logout across tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "jwt_token" && event.newValue === null) {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = useCallback(async ({ email, password }: AuthCredentials) => {
    setLoading(true);

    try {
      // Call backend API
      await authService.login({ email, password });

      // Fetch full user data
      const userResponse = await authService.getCurrentUser();
      const authUser = buildAuthUser(userResponse);
      const storedUser = buildStoredUser(userResponse);

      // Save to localStorage for ProfilePage
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.activeUser,
        JSON.stringify(storedUser)
      );

      setUser(authUser);
    } catch (error) {
      setLoading(false);
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }

    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(
    async (updatedUser?: StoredUser) => {
      // Si se pasa un usuario actualizado desde ProfilePage, actualizar el estado
      if (updatedUser) {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.activeUser,
          JSON.stringify(updatedUser)
        );

        // NOTE: When updating from ProfilePage (StoredUser), we might miss sensitive data
        // needed for discount calculation if StoredUser doesn't have it.
        // However, ProfilePage fetches full data now, so we should probably fetch from backend here too
        // to ensure we have the correct discount info.
        // For now, let's re-fetch from backend to be safe and consistent.
        if (authService.isAuthenticated()) {
          try {
            const userResponse = await authService.getCurrentUser();
            const authUser = buildAuthUser(userResponse);
            setUser(authUser);
          } catch (error) {
            console.error("Failed to refresh user from backend:", error);
          }
        }
        return;
      }

      // Si no, obtener desde el backend
      if (authService.isAuthenticated()) {
        try {
          const userResponse = await authService.getCurrentUser();
          const authUser = buildAuthUser(userResponse);
          const storedUser = buildStoredUser(userResponse);

          localStorage.setItem(
            LOCAL_STORAGE_KEYS.activeUser,
            JSON.stringify(storedUser)
          );

          setUser(authUser);
        } catch (error) {
          console.error("Failed to refresh user:", error);
          logout();
        }
      }
    },
    [logout]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshUser: async (updatedUser?: StoredUser) => {
        await refreshUser(updatedUser);
      },
    }),
    [loading, login, logout, refreshUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
