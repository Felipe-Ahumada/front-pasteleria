import apiClient from "@/config/axiosConfig";

export interface Usuario {
  id: string;
  run: number;
  dv: string;
  nombre: string;
  apellidos: string;
  correo: string;
  fechaNacimiento: string;
  tipoUsuario: string;
  regionId: string;
  regionNombre: string;
  comuna: string;
  direccion: string;
  password: string;
  createdAt?: string;
  activo?: boolean;
}

// Helper to map backend response to frontend Usuario model
const mapUserResponseToUsuario = (data: any): Usuario => {
  return {
    id: data.id.toString(),
    run: parseInt(data.run.replace(/[^0-9]/g, "") || "0"),
    dv: data.dv || "",
    nombre: data.nombre,
    apellidos: data.apellidos,
    correo: data.correo,
    fechaNacimiento: data.fechaNacimiento || "",
    tipoUsuario: data.tipoUsuario,
    regionId: data.regionId || "",
    regionNombre: data.regionNombre || "",
    comuna: data.comuna || "",
    direccion: data.direccion || "",
    password: "", // Password is never returned from backend for security
    activo: data.activo,
  };
};

export const userService = {
  async getAll(): Promise<Usuario[]> {
    const { data } = await apiClient.get<any[]>("/users");
    return data.map(mapUserResponseToUsuario);
  },

  async getCached(): Promise<Usuario[]> {
    // For now, alias to getAll. Caching can be implemented with React Query or similar if needed.
    return this.getAll();
  },

  async getActive(): Promise<Usuario[]> {
    const users = await this.getAll();
    return users.filter((u) => u.activo !== false);
  },

  async getById(id: string): Promise<Usuario | undefined> {
    try {
      const { data } = await apiClient.get<any>(`/users/${id}`);
      return mapUserResponseToUsuario(data);
    } catch (error) {
      console.error("Error fetching user by id:", error);
      return undefined;
    }
  },

  async add(user: Usuario): Promise<void> {
    // Map frontend Usuario to backend expected format
    const payload = {
      ...user,
      run: `${user.run}${user.dv}`, // Backend expects full run string? Or separate?
      // Based on AuthController register, it expects a User object.
      // Let's assume the backend handles the mapping or we send what matches User entity.
      // Adjusting based on UserResponse DTO seen earlier:
      // Backend User entity likely has: run, dv, nombre, apellidos, correo, password, etc.
    };

    // Use auth register endpoint for adding users if it's a public registration,
    // or a specific admin endpoint if it exists.
    // The previous code used local storage, so it was likely "admin adding user".
    // We'll use the register endpoint for now as it's the most likely candidate for creating a user.
    await apiClient.post("/auth/register", payload);
  },

  async update(updated: Usuario): Promise<void> {
    // Map frontend role to backend role
    let backendRole = updated.tipoUsuario;
    switch (updated.tipoUsuario) {
      case "SuperAdmin":
        backendRole = "ROLE_SUPERADMIN";
        break;
      case "Administrador":
        backendRole = "ROLE_ADMIN";
        break;
      case "Vendedor":
        backendRole = "ROLE_SELLER";
        break;
      case "Cliente":
        backendRole = "ROLE_CUSTOMER";
        break;
      default:
        // If it's already in ROLE_ format or unknown, leave it as is
        break;
    }

    const payload = {
      ...updated,
      tipoUsuario: backendRole,
    };

    await apiClient.put(`/users/${updated.id}`, payload);
  },

  async setStatus(id: string, activo: boolean): Promise<void> {
    if (!activo) {
      await apiClient.delete(`/users/${id}`); // The backend delete endpoint deactivates the user
    } else {
      // Backend doesn't seem to have an explicit "activate" endpoint in the controller we saw.
      // We might need to use update to set active=true.
      // Fetch user first
      const user = await this.getById(id);
      if (user) {
        await this.update({ ...user, activo: true });
      }
    }
  },

  async block(id: string): Promise<void> {
    await this.setStatus(id, false);
  },

  async unblock(id: string): Promise<void> {
    await this.setStatus(id, true);
  },

  async delete(id: string): Promise<void> {
    await this.block(id);
  },
};
