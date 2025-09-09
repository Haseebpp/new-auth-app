import { create } from 'zustand';

type BookingState = {
  serviceId: string | null;
  date: string | null; // YYYY-MM-DD
  scheduledAt: string | null; // ISO string
  notes: string;
  setServiceId: (id: string | null) => void;
  setDate: (date: string | null) => void;
  setScheduledAt: (iso: string | null) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  serviceId: null,
  date: null,
  scheduledAt: null,
  notes: '',
  setServiceId: (serviceId) => set({ serviceId }),
  setDate: (date) => set({ date }),
  setScheduledAt: (scheduledAt) => set({ scheduledAt }),
  setNotes: (notes) => set({ notes }),
  reset: () => set({ serviceId: null, date: null, scheduledAt: null, notes: '' }),
}));

