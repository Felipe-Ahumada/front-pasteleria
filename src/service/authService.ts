import apiClient from "@/config/axiosConfig";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  correo: string;
  nombre: string;
  role: string;
}

export interface UserResponse {
  id: number;
  run: string;
  dv?: string;
  nombre: string;
  apellidos: string;
  correo: string;
  fechaNacimiento?: string;
  codigoDescuento?: string;
  tipoUsuario: string;
  regionId: string;
  regionNombre: string;
  comuna: string;
  direccion: string;
  avatarUrl?: string;
  activo: boolean;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );
    // Store token
    localStorage.setItem("jwt_token", data.token);
    return data;
  },

  async getCurrentUser(): Promise<UserResponse> {
    const { data } = await apiClient.get<UserResponse>("/auth/me");
    return data;
  },

  logout() {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("activeUser");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("jwt_token");
  },

  getToken(): string | null {
    return localStorage.getItem("jwt_token");
  },
};
