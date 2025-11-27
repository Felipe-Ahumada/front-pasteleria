import { useState, useEffect } from "react";
import {
  locationService,
  type Region,
  type Comuna,
} from "@/service/locationService";

export const useLocations = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      setLoading(true);
      try {
        const data = await locationService.getRegions();
        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  const fetchComunas = async (regionCodigo: string) => {
    if (!regionCodigo) {
      setComunas([]);
      return;
    }

    setLoading(true);
    try {
      const data = await locationService.getComunasByRegion(regionCodigo);
      setComunas(data);
    } catch (error) {
      console.error("Error fetching comunas:", error);
      setComunas([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    regions,
    comunas,
    fetchComunas,
    loading,
  };
};
