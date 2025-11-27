import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "@/context/auth/AuthProvider";
import useAuth from "@/hooks/useAuth";
import { authService } from "@/service/authService";

// Mock dependencies
vi.mock("@/service/authService", () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    isAuthenticated: vi.fn(),
  },
}));

// Helper component to consume context
const TestComponent = () => {
  const { user, login, logout, refreshUser, loading, isAuthenticated } =
    useAuth();
  return (
    <div>
      <div data-testid="user-name">{user?.name}</div>
      <div data-testid="user-role">{user?.role}</div>
      <div data-testid="is-authenticated">{String(isAuthenticated)}</div>
      <div data-testid="loading">{String(loading)}</div>
      <button
        onClick={() =>
          login({ email: "test@example.com", password: "password" }).catch(
            () => {}
          )
        }
      >
        Login
      </button>
      <button onClick={logout}>Logout</button>
      <button
        onClick={() =>
          refreshUser({
            id: "1",
            nombre: "Juan",
            apellidos: "Perez",
            correo: "juan@example.com",
            password: "pass",
            tipoUsuario: "Vendedor",
            activo: true,
            run: "12.345.678-9",
            regionId: "1",
            regionNombre: "Metropolitana",
            comuna: "Santiago",
            direccion: "Calle Falsa 123",
          })
        }
      >
        Refresh
      </button>
    </div>
  );
};

describe("AuthProvider", () => {
  const mockUserResponse = {
    id: 1,
    nombre: "Felipe",
    apellidos: "Ahumada",
    correo: "felipe@example.com",
    tipoUsuario: "ROLE_SUPERADMIN",
    activo: true,
    run: "98.765.432-1",
    regionId: "1",
    regionNombre: "Metropolitana",
    comuna: "Providencia",
    direccion: "Av. Siempre Viva 742",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("initializes with no user if not authenticated", async () => {
    (authService.isAuthenticated as any).mockReturnValue(false);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
    expect(screen.getByTestId("user-name")).toBeEmptyDOMElement();
  });

  it("initializes with user if authenticated", async () => {
    (authService.isAuthenticated as any).mockReturnValue(true);
    (authService.getCurrentUser as any).mockResolvedValue(mockUserResponse);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId("is-authenticated")).toHaveTextContent("true");
    expect(screen.getByTestId("user-name")).toHaveTextContent("Felipe Ahumada");
    expect(screen.getByTestId("user-role")).toHaveTextContent("superadmin");
  });

  it("handles login success", async () => {
    (authService.isAuthenticated as any).mockReturnValue(false);
    (authService.login as any).mockResolvedValue({ token: "token" });
    (authService.getCurrentUser as any).mockResolvedValue(mockUserResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText("Login");
    await act(async () => {
      loginButton.click();
    });

    expect(screen.getByTestId("is-authenticated")).toHaveTextContent("true");
    expect(screen.getByTestId("user-name")).toHaveTextContent("Felipe Ahumada");
  });

  it("handles login failure", async () => {
    (authService.isAuthenticated as any).mockReturnValue(false);
    (authService.login as any).mockRejectedValue(
      new Error("Invalid credentials")
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText("Login");
    await act(async () => {
      loginButton.click();
    });

    expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
  });

  it("handles logout", async () => {
    (authService.isAuthenticated as any).mockReturnValue(true);
    (authService.getCurrentUser as any).mockResolvedValue(mockUserResponse);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    const logoutButton = screen.getByText("Logout");
    act(() => {
      logoutButton.click();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(screen.getByTestId("is-authenticated")).toHaveTextContent("false");
  });
});
