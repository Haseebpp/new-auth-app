import { api } from "@/state/services/authService";

export type Service = {
  _id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  openHour?: number;
  closeHour?: number;
};

export type Slot = { start: string; end: string };

export async function getServices(): Promise<{ services: Service[] }> {
  const { data } = await api.get<{ services: Service[] }>(`/services`);
  return data;
}

export async function getServiceSlots(serviceId: string, dateISO: string, step: number = 30): Promise<{ slots: Slot[] }> {
  const { data } = await api.get<{ slots: Slot[] }>(`/services/${serviceId}/slots`, {
    params: { date: dateISO, step },
  });
  return data;
}

