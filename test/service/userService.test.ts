import { describe, it, expect, vi, beforeEach } from "vitest";
import { userService } from "@/service/userService";
import apiClient from "@/config/axiosConfig";

// Mock apiClient
vi.mock("@/config/axiosConfig", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockUsers: any[] = [
  {
    id: "1",
    nombre: "Test",
    apellidos: "User",
    correo: "test@example.com",
    password: "",
    tipoUsuario: "Cliente",
    run: "11.111.111",
    dv: "1",
    regionId: "1",
    regionNombre: "Metropolitana",
    comuna: "Santiago",
    direccion: "Calle 1",
    fechaNacimiento: "1990-01-01",
    activo: true,
  },
];

describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAll fetches users from API", async () => {
    (apiClient.get as any).mockResolvedValue({ data: mockUsers });

    const users = await userService.getAll();

    expect(apiClient.get).toHaveBeenCalledWith("/users");
    expect(users).toHaveLength(1);
    expect(users[0].id).toBe("1");
  });

  it("getById fetches user from API", async () => {
    (apiClient.get as any).mockResolvedValue({ data: mockUsers[0] });

    const user = await userService.getById("1");

    expect(apiClient.get).toHaveBeenCalledWith("/users/1");
    expect(user).toBeDefined();
    expect(user?.id).toBe("1");
  });

  it("getById returns undefined on error", async () => {
    (apiClient.get as any).mockRejectedValue(new Error("Not found"));

    const user = await userService.getById("999");

    expect(user).toBeUndefined();
  });

  it("add sends post request to API", async () => {
    (apiClient.post as any).mockResolvedValue({ data: mockUsers[0] });

    await userService.add(mockUsers[0]);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/auth/register",
      expect.any(Object)
    );
  });

  it("update sends put request to API", async () => {
    (apiClient.put as any).mockResolvedValue({ data: mockUsers[0] });

    await userService.update(mockUsers[0]);

    expect(apiClient.put).toHaveBeenCalledWith("/users/1", mockUsers[0]);
  });

  it("setStatus sends delete request if active is false", async () => {
    (apiClient.delete as any).mockResolvedValue({});

    await userService.setStatus("1", false);

    expect(apiClient.delete).toHaveBeenCalledWith("/users/1");
  });

  it("setStatus updates user if active is true", async () => {
    (apiClient.get as any).mockResolvedValue({ data: mockUsers[0] });
    (apiClient.put as any).mockResolvedValue({});

    await userService.setStatus("1", true);

    expect(apiClient.get).toHaveBeenCalledWith("/users/1");
    expect(apiClient.put).toHaveBeenCalledWith(
      "/users/1",
      expect.objectContaining({ activo: true })
    );
  });
});
