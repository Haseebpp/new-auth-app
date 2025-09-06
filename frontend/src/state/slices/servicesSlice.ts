import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/state/store";
import * as ServiceAPI from "@/state/services/serviceService";
import type { Service, Slot } from "@/state/services/serviceService";

type ServicesState = {
  items: Service[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | { message?: string; errors?: Record<string, string> } | null;
  slotsByKey: Record<string, Slot[]>; // key: `${serviceId}|${date}`
  slotsStatus: "idle" | "loading" | "succeeded" | "failed";
};

const initialState: ServicesState = {
  items: [],
  status: "idle",
  error: null,
  slotsByKey: {},
  slotsStatus: "idle",
};

const keyFor = (serviceId: string, date: string) => `${serviceId}|${date}`;

function extractError(err: any, fallback: string) {
  const data = err?.response?.data;
  if (data && (typeof data === "object") && (data.errors || data.message)) return data;
  return fallback;
}

export const fetchServices = createAsyncThunk("services/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await ServiceAPI.getServices();
    return res.services;
  } catch (err: any) {
    return rejectWithValue(extractError(err, "Failed to load services"));
  }
});

export const fetchServiceSlots = createAsyncThunk(
  "services/fetchSlots",
  async (payload: { serviceId: string; date: string; step?: number }, { rejectWithValue }) => {
    try {
      const res = await ServiceAPI.getServiceSlots(payload.serviceId, payload.date, payload.step ?? 30);
      return { ...payload, slots: res.slots };
    } catch (err: any) {
      return rejectWithValue(extractError(err, "Failed to load slots"));
    }
  }
);

const slice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action: PayloadAction<Service[]>) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load services";
      })
      .addCase(fetchServiceSlots.pending, (state) => {
        state.slotsStatus = "loading";
      })
      .addCase(
        fetchServiceSlots.fulfilled,
        (state, action: PayloadAction<{ serviceId: string; date: string; step?: number; slots: Slot[] }>) => {
          state.slotsStatus = "succeeded";
          state.slotsByKey[keyFor(action.payload.serviceId, action.payload.date)] = action.payload.slots;
        }
      )
      .addCase(fetchServiceSlots.rejected, (state, action: any) => {
        state.slotsStatus = "failed";
        state.error = action.payload || "Failed to load slots";
      });
  },
});

export default slice.reducer;

// Selectors
export const selectServices = (s: RootState) => s.services.items;
export const selectServicesStatus = (s: RootState) => s.services.status;
export const selectServiceById = (id: string) => (s: RootState) => s.services.items.find((svc) => svc._id === id);
export const selectSlotsFor = (serviceId: string, date: string) => (s: RootState) => s.services.slotsByKey[keyFor(serviceId, date)] || [];
export const selectSlotsStatus = (s: RootState) => s.services.slotsStatus;

