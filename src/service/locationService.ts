import apiClient from "@/config/axiosConfig";

export type Region = {
  id: number;
  codigo: string;
  nombre: string;
};

export type Comuna = {
  id: number;
  nombre: string;
};

export const locationService = {
  async getRegions(): Promise<Region[]> {
    const { data } = await apiClient.get<Region[]>("/locations/regions");
    return data;
  },

  async getComunasByRegion(regionCodigo: string): Promise<Comuna[]> {
    const { data } = await apiClient.get<Comuna[]>(
      `/locations/regions/${regionCodigo}/comunas`
    );
    return data;
  },
};
