import api from './client';

export type Order = {
  _id: string;
  user: { _id: string; name: string; number: string } | string;
  service: { _id: string; name: string; durationMinutes: number; price: number } | string;
  scheduledAt: string;
  scheduledEndAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  createdAt?: string;
};

export async function createOrder(payload: {
  serviceId: string;
  scheduledAt: string;
  notes?: string;
}): Promise<{ order: Order }> {
  const { data } = await api.post<{ order: Order }>(`/orders`, payload);
  return data;
}

export async function getOrders(): Promise<{ orders: Order[] }> {
  const { data } = await api.get<{ orders: Order[] }>(`/orders`);
  return data;
}

export async function cancelOrder(orderId: string): Promise<{ order: Order }> {
  const { data } = await api.patch<{ order: Order }>(`/orders/${orderId}/cancel`);
  return data;
}

